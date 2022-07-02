import {
  AutocompleteRunOptions,
  SlashCommand,
  SlashCommandRunOptions,
} from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Searcher } from 'fast-fuzzy';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

class UnbanCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Разбанить пользователя')
    .addStringOption((option) => {
      return option
        .setName('пользователь')
        .setDescription('Пользователь, которого вы хотите разбанить')
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addStringOption((option) => {
      return option.setName('причина').setDescription('Причина разбана').setRequired(false);
    });

  async run({ client, interaction }: SlashCommandRunOptions) {
    if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
      const embed = ErrorEmbed('У вас нет прав на эту команду');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetUserId = interaction.options.getString('пользователь', true);
    const user = await client.users.fetch(targetUserId).catch(() => {});

    if (!user) {
      const embed = ErrorEmbed('Пользователь не найден');
      embed.setFooter({ text: 'Возможно, он удалил аккаунт или его забанил сам Discord' });
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const reason = interaction.options.getString('причина', false);

    interaction.guild.bans.remove(targetUserId, reason);

    const embed = SuccessEmbed(`Пользователь ${user} был разбанен`);
    const directEmbed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setDescription(
        `${Emojis.Info} На сервере \`${interaction.guild}\` Вас разбанил пользователь ${interaction.user}`,
      )
      .setTimestamp();

    client.service.removeBan(`${targetUserId}-${interaction.guild.id}`, interaction.user.id, reason);

    if (reason) {
      embed.setFooter({ text: `Причина разбана: ${reason}` });
      directEmbed.setFooter({ text: `Причина разбана: ${reason}` });
    }

    user.send({ embeds: [directEmbed] }).catch(() => {});
    interaction.reply({ embeds: [embed] });
  }

  async handleAutocomplete({ interaction }: AutocompleteRunOptions) {
    const focusedValue = interaction.options.getFocused(true);

    if (focusedValue.name !== 'пользователь') {
      return;
    }

    const bans = await interaction.guild.bans.fetch();

    const mappedBans = bans.map((ban) => {
      return {
        name: `@${ban.user.tag}`,
        value: ban.user.id,
      };
    });

    if (focusedValue.value === '') {
      await interaction.respond(mappedBans.slice(0, 25));
      return;
    }

    const searcher = new Searcher(mappedBans, {
      keySelector: (item) => item.name,
    });

    const filteredBans = searcher.search(focusedValue.value as string);

    await interaction.respond(filteredBans.slice(0, 25));
  }
}

export default new UnbanCommand();
