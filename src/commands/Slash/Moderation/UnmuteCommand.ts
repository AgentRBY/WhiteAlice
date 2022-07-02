import {
  AutocompleteRunOptions,
  SlashCommand,
  SlashCommandRunOptions,
} from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Searcher } from 'fast-fuzzy';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import moment from 'moment/moment';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { getMemberBaseId } from '../../../utils/Other';

class UnmuteCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Размутить пользователя')
    .addStringOption((option) => {
      return option
        .setName('пользователь')
        .setDescription('Пользователь, которого вы хотите размутить')
        .setRequired(true)
        .setAutocomplete(true);
    })
    .addStringOption((option) => {
      return option.setName('причина').setDescription('Причина размута').setRequired(false);
    });

  async run({ client, interaction }: SlashCommandRunOptions) {
    if (!interaction.memberPermissions.has('BAN_MEMBERS')) {
      const embed = ErrorEmbed('У вас нет прав на эту команду');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const targetUserId = interaction.options.getString('пользователь', true);
    const targetMember = await interaction.guild.members.fetch(targetUserId);

    const reason = interaction.options.getString('причина', false);

    const remainingMuteTime = Date.now() - targetMember.communicationDisabledUntilTimestamp;
    const remainingMuteTimeHumanize = moment.duration(remainingMuteTime).locale('ru').humanize();

    await targetMember.timeout(null);

    const embed = SuccessEmbed(`Пользователь ${targetMember} был размучен
        Если бы не вы, ему осталось бы сидеть в муте ${remainingMuteTimeHumanize}`);
    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${interaction.guild}\` Вы были размучены пользователем ${interaction.user}`,
      )
      .setColor(Colors.Green);

    client.service.removeMute(getMemberBaseId(targetMember), interaction.user.id, reason);

    if (reason) {
      embed.setFooter({ text: `Причина размута: ${reason}` });
      directEmbed.setFooter({ text: `Причина размута: ${reason}` });
    }

    interaction.reply({ embeds: [embed] });
    targetMember.send({ embeds: [directEmbed] });
  }

  async handleAutocomplete({ client, interaction }: AutocompleteRunOptions) {
    const focusedValue = interaction.options.getFocused(true);

    if (focusedValue.name !== 'пользователь') {
      return;
    }

    const currentMutes = await client.service.getCurrentMutes(interaction.guild.id);

    const mappedMutes = currentMutes
      .map((user) => {
        const member = interaction.guild.members.cache.get(user._id.split('-')[0]);

        if (!member) {
          return;
        }

        return {
          name: `@${member.user.tag}`,
          value: member.id,
        };
      })
      .filter(Boolean);

    if (focusedValue.value === '') {
      await interaction.respond(mappedMutes.slice(0, 25));
      return;
    }

    const searcher = new Searcher(mappedMutes, {
      keySelector: (item) => item.name,
    });

    const filteredBans = searcher.search(focusedValue.value as string);

    await interaction.respond(filteredBans.slice(0, 25));
  }
}

export default new UnmuteCommand();
