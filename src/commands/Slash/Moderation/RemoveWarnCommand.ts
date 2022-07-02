import {
  AutocompleteRunOptions,
  SlashCommand,
  SlashCommandRunOptions,
} from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getMemberBaseId } from '../../../utils/Other';
import { GuildMember, MessageEmbed } from 'discord.js';
import { Searcher } from 'fast-fuzzy';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

class RemoveWarnCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Снять предупреждение у пользователя')
    .addUserOption((option) => {
      return option
        .setName('пользователь')
        .setDescription('Пользователь, у которого нужно снять предупреждение')
        .setRequired(true);
    })
    .addNumberOption((option) => {
      return option
        .setName('предупреждение')
        .setDescription('Предупреждение, которое нужно снять')
        .setAutocomplete(true)
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option.setName('причина').setDescription('Причина мута').setRequired(false);
    });

  async run({ client, interaction }: SlashCommandRunOptions) {
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

    const warnId = interaction.options.getNumber('предупреждение', true);

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    if (warns.length < warnId + 1) {
      const embed = ErrorEmbed('У пользователя нет предупреждения под этим номером').setFooter({
        text: 'Что бы узнать номер предупреждения пользователя введите >warns',
      });
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (warns[warnId].removed) {
      const embed = ErrorEmbed('Предупреждение уже удалено');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const reason = interaction.options.getString('причина', false);

    client.service.removeWarn(getMemberBaseId(targetMember), warnId, interaction.user.id, reason);

    const embed = SuccessEmbed(`У пользователя ${targetMember} было снято предупреждение №${warnId + 1}`);
    const directEmbed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setDescription(
        `${Emojis.Info} На сервере \`${interaction.guild}\` у Вас было снято предупреждение №${warnId + 1}`,
      )
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `Причина снятия: ${reason}` });
      directEmbed.setFooter({ text: `Причина снятия: ${reason}` });
    }

    interaction.reply({ embeds: [embed] });
    targetMember.send({ embeds: [directEmbed] });
  }

  async handleAutocomplete({ client, interaction }: AutocompleteRunOptions) {
    const focusedValue = interaction.options.getFocused(true);

    if (focusedValue.name !== 'предупреждение') {
      return;
    }

    const targetUserId = interaction.options.data.find((option) => option.name === 'пользователь').value;
    const targetMember = interaction.guild.members.cache.get(targetUserId as string);

    if (!(targetMember instanceof GuildMember)) {
      return;
    }

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    if (!warns.length) {
      interaction.respond([]);
      return;
    }

    const mappedWarns = warns
      .slice(0, 25)
      .map((warn, index) => {
        if (warn.removed) {
          return;
        }

        return {
          name: `📝 Предупреждение №${index + 1}` + (warn.reason ? `. Причина: ${warn.reason}` : ''),
          value: index,
        };
      })
      .filter(Boolean);

    if (focusedValue.value === '') {
      await interaction.respond(mappedWarns);
      return;
    }

    const searcher = new Searcher(mappedWarns, {
      keySelector: (item) => item.name,
    });

    const filteredWarns = searcher.search(focusedValue.value as string);

    await interaction.respond(filteredWarns);
  }
}

export default new RemoveWarnCommand();
