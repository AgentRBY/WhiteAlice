import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { GuildMember, MessageEmbed } from 'discord.js';
import { getMemberBaseId } from '../../../utils/Other';
import { Emojis } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { Warn } from '../../../typings/MemberModel';

class WarnCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Выдать предупреждение пользователю')
    .addUserOption((option) => {
      return option
        .setName('пользователь')
        .setDescription('Пользователь которому нужно выдать предупреждение')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option.setName('причина').setDescription('Причина, из-за которой выдано предупреждение').setRequired(true);
    });

  async run({ client, interaction }: SlashCommandRunOptions) {
    console.log(interaction);
    if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
      const embed = ErrorEmbed('У вас нет прав на эту команду');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetMember = interaction.options.getMember('пользователь', true);

    if (!(targetMember instanceof GuildMember)) {
      const embed = ErrorEmbed('Ошибка');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    const reason = interaction.options.getString('причина', true);

    const embed = SuccessEmbed(`Пользователю ${targetMember} было выдано предупреждение`)
      .setTimestamp()
      .setFooter({ text: `Причина: ${reason}` });

    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${interaction.guild}\` Вам было выдано предупреждение пользователем ${
          interaction.user
        }
        Это уже ваше \`${warns.length + 1}\` предупреждение`,
      )
      .setColor(Colors.Red)
      .setTimestamp()
      .setFooter({ text: `Причина: ${reason}` });

    const warn: Warn = {
      date: Date.now(),
      reason: reason,
      givenBy: interaction.user.id,
    };

    client.service.addWarn(getMemberBaseId(targetMember), warn);

    interaction.reply({ embeds: [embed] });
    targetMember.send({ embeds: [directEmbed] });
  }
}

export default new WarnCommand();
