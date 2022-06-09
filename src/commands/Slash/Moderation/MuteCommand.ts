import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { GuildMember, MessageEmbed } from 'discord.js';
import { getMemberBaseId } from '../../../utils/Other';
import { formatDuration, formatDurationInPast, getDurationFromString } from '../../../utils/Common/Date';
import moment from 'moment/moment';
import { Emojis } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { Mute } from '../../../typings/MemberModel';

class MuteCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Замутить пользователя')
    .addUserOption((option) => {
      return option.setName('пользователь').setDescription('Пользователь которого нужно замутить').setRequired(true);
    })
    .addStringOption((option) => {
      const timeVariants = [
        {
          name: '🕐 1 час',
          value: '1h',
        },
        {
          name: '🕑 2 часа',
          value: '2h',
        },
        {
          name: '🕓 4 часа',
          value: '4h',
        },
        {
          name: '🕕 6 часов',
          value: '6h',
        },
        {
          name: '🕗 8 часов',
          value: '8h',
        },
        {
          name: '🕛 12 часов',
          value: '12h',
        },
        {
          name: '🕕 18 часов',
          value: '18h',
        },
        {
          name: '🕛 24 часа',
          value: '24h',
        },
        {
          name: '🕛 1 день',
          value: '1d',
        },
      ];

      return option
        .setName('время')
        .setDescription('Время, на которое нужно замутить пользователя')
        .setRequired(true)
        .addChoices(...timeVariants);
    })
    .addStringOption((option) => {
      return option.setName('причина').setDescription('Причина мута').setRequired(false);
    })
    .addBooleanOption((option) => {
      return option
        .setName('насильно')
        .setDescription('Перемутить человека на новое время если он уже в муте')
        .setRequired(false);
    });

  async run({ client, interaction }: SlashCommandRunOptions) {
    const targetMember = interaction.options.getMember('пользователь', true);

    if (!(targetMember instanceof GuildMember)) {
      const embed = ErrorEmbed('Ошибка');
      interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true });
      return;
    }

    if (
      targetMember.permissions.has('BAN_MEMBERS') ||
      targetMember.permissions.has('MODERATE_MEMBERS') ||
      targetMember.roles.highest.comparePositionTo(interaction.guild.me.roles.highest) >= 0 ||
      targetMember.permissions.has('ADMINISTRATOR')
    ) {
      const embed = ErrorEmbed('У вас нет прав, что бы замутить этого пользователя');
      interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true });
      return;
    }

    const forceMute = interaction.options.getBoolean('насильно', false);

    if (targetMember.communicationDisabledUntilTimestamp > Date.now() && !forceMute) {
      const duration = targetMember.communicationDisabledUntilTimestamp - Date.now();

      const embed = ErrorEmbed('Пользователь уже в муте');
      embed.setFooter({
        text: `Осталось до размута: ${formatDurationInPast(moment.duration(duration))}`,
      });

      interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true });
      return;
    }

    const time = getDurationFromString(interaction.options.getString('время', true));

    const reason = interaction.options.getString('причина', false);

    const totalTime = await client.service.calculateMuteTime(getMemberBaseId(targetMember), time.asMilliseconds());
    const formattedTime = formatDuration(moment.duration(totalTime));
    const formattedTotalTimeWithOnlyKarma = formatDurationInPast(moment.duration(totalTime - time.asMilliseconds()));

    const karma = await client.service.getKarma(getMemberBaseId(targetMember));

    const text = karma
      ? `Пользователь ${targetMember} был замучен на ${formattedTime}, из них ${formattedTotalTimeWithOnlyKarma} (+${karma}%) он получил из-за кармы`
      : `Пользователь ${targetMember} был замучен на ${formattedTime}`;
    const directText = `${Emojis.Info} На сервере \`${interaction.guild}\` Вы были замучены пользователем ${
      interaction.member
    } на ${formattedTime}
    ${karma ? `Из них ${formattedTotalTimeWithOnlyKarma} (+${karma}%) Вы получили из-за кармы` : ''}`;

    const embed = SuccessEmbed(text);
    const directEmbed = new MessageEmbed().setDescription(directText).setColor(Colors.Red).setTimestamp();

    if (reason) {
      embed.setFooter({ text: `По причине: ${reason}` });
      directEmbed.setFooter({ text: `По причине: ${reason}` });
    }

    await targetMember.timeout(totalTime, reason);

    const mute: Mute = {
      date: Date.now(),
      reason: reason,
      givenBy: interaction.user.id,
      time: totalTime,
    };

    client.service.addMute(getMemberBaseId(targetMember), mute);

    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    targetMember.send({ embeds: [directEmbed] });
  }
}

export default new MuteCommand();
