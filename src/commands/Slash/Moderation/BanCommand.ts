import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, MessageEmbed } from 'discord.js';
import { client } from '../../../app';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { Ban } from '../../../typings/MemberModel';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class BanCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Забанить пользователя')
    .addUserOption((option) => {
      return option
        .setName('пользователь')
        .setDescription('Пользователь, которого вы хотите забанить')
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option.setName('причина').setDescription('Причина бана').setRequired(false);
    });

  async run({ interaction }: SlashCommandRunOptions) {
    if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
      const embed = ErrorEmbed('У вас нет прав на эту команду');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const targetMember = interaction.options.getMember('пользователь', true);

    if (!(targetMember instanceof GuildMember)) {
      const embed = ErrorEmbed('Ошибка');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.guild.bans.fetch();

    if (interaction.guild.bans.cache.get(targetMember.id)) {
      const embed = ErrorEmbed('Пользователь уже в бане');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!targetMember.bannable) {
      const embed = ErrorEmbed('У меня нет прав, что бы забанить этого пользователя');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (!targetMember.bannable) {
      const embed = ErrorEmbed('У меня нет прав, что бы забанить этого пользователя');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    if (targetMember.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) >= 0) {
      const embed = ErrorEmbed('У вас нет прав, что бы замутить этого пользователя');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const reason = interaction.options.getString('причина', false);

    const embed = SuccessEmbed(`Пользователь ${targetMember} был забанен`);
    const directEmbed = new MessageEmbed()
      .setColor(Colors.Red)
      .setDescription(
        `${Emojis.Info} На сервере \`${targetMember.guild}\` Вы получили бан от пользователя ${interaction.user}`,
      )
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `Причина: ${reason}` });
      directEmbed.setFooter({ text: `Причина: ${reason}` });
    }

    const ban: Ban = {
      date: Date.now(),
      reason,
      givenBy: client.user.id,
      messageDeleteCountInDays: 0,
    };

    client.service.addBan(`${targetMember.id}-${targetMember.guild.id}`, ban);

    await targetMember.send({ embeds: [directEmbed] }).catch(() => {});
    interaction.reply({ embeds: [embed] });

    interaction.guild.bans.create(targetMember.id, {
      reason,
    });
  }
}

export default new BanCommand();
