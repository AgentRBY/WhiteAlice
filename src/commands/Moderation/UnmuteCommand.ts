import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import moment from 'moment';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { client } from '../../app';
import { getMemberBaseId } from '../../utils/Other';

export default new Command({
  name: 'unmute',
  category: 'Moderation',
  aliases: ['removeMute'],
  description: 'Размучивает человека, если он был замучен',
  examples: [
    {
      command: 'unmute @TestUser',
      description: 'Убирает мут у пользователя @TestUser',
    },
    {
      command: 'unmute @TestUser Ошибочный мут',
      description: 'Убирает мут у пользователя @TestUser по причине `Ошибочный мут`',
    },
  ],
  usage: 'unmute <пользователь> [причина]',
  botPermissions: ['MODERATE_MEMBERS'],
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args }) => {
    const targetMember = message.mentions.members.first();

    if (!targetMember) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!targetMember.isCommunicationDisabled()) {
      const embed = ErrorEmbed('Пользователь не в муте');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const reason = args.slice(1).join(' ');

    const remainingMuteTime = Date.now() - targetMember.communicationDisabledUntilTimestamp;
    const remainingMuteTimeHumanize = moment.duration(remainingMuteTime).locale('ru').humanize();

    await targetMember.timeout(null);

    const embed = SuccessEmbed(`Пользователь ${targetMember} был размучен
        Если бы не вы, ему осталось бы сидеть в муте ${remainingMuteTimeHumanize}`);
    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вы были размучены пользователем ${message.author}`,
      )
      .setColor(Colors.Green);

    client.service.removeMute(getMemberBaseId(targetMember), message.author.id, reason);

    if (reason) {
      embed.setFooter({ text: `Причина размута: ${reason}` });
      directEmbed.setFooter({ text: `Причина размута: ${reason}` });
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    targetMember.send({ embeds: [directEmbed] });
  },
});
