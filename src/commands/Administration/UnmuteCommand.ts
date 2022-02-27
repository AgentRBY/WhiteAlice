import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import moment from 'moment';

export default new Command({
  name: 'unmute',
  category: 'Administration',
  aliases: [],
  description: 'Размучивает человека, если он был замучен',
  examples: [
    {
      command: 'unmute @TestUser',
      description: 'Убирает мут у пользователя @TestUser',
    },
  ],
  usage: 'unmute <пользователь>',
  botPermissions: ['MODERATE_MEMBERS'],
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message }) => {
    const member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!member.isCommunicationDisabled()) {
      const embed = ErrorEmbed('Пользователь не в муте');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const remainingMuteTime = Date.now() - member.communicationDisabledUntilTimestamp;
    const remainingMuteTimeHumanize = moment.duration(remainingMuteTime).locale('ru').humanize();

    await member.timeout(null);

    const embed = SuccessEmbed('Пользователь был размучен');
    embed.setFooter({ text: `Если бы не вы, ему осталось бы сидеть в муте ${remainingMuteTimeHumanize}` });
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
