import { Command } from '../../structures/Command';
import { MemberModel } from '../../models/MemberModel';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { formatDays, momentToDiscordDate } from '../../utils/Date';
import moment from 'moment';

export default new Command({
  name: 'bans',
  category: 'Moderation',
  aliases: [],
  description: 'Выводит список всех банов у пользователя',
  examples: [
    {
      command: '>bans @TestUser',
      description: 'Выводит список всех банов у пользователя TestUser',
    },
  ],
  usage: 'bans [пользователь]',
  run: async ({ message }) => {
    const member = message.mentions.members.first() || message.member;

    const MemberBase = await MemberModel.findById(`${member.id}-${message.guild.id}`);

    if (!MemberBase) {
      const embed = ErrorEmbed('Пользователь не найден в базе');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!MemberBase.bans.length) {
      const embed = SuccessEmbed('Баны отсутствуют');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .addFields(
        MemberBase.bans.map((ban, index) => ({
          name: `Бан №${index + 1}`,
          value: `**Выдан:** ${message.guild.members.cache.get(ban.givenBy) || 'Неизвестно'}
                **Причина:** ${ban.reason || 'Отсутствует'}
                **Время:** ${momentToDiscordDate(moment(ban.date))}${
            ban.messageDeleteCountInDays
              ? `\n**Было удалено сообщений:** За последни${
                  ban.messageDeleteCountInDays === 1 ? 'й' : 'е'
                } ${formatDays(ban.messageDeleteCountInDays)}`
              : ''
          }${!ban.unbanned && index !== MemberBase.bans.length ? '\n**Был разбанен:** Да' : ''}
          ${
            ban.unbanned
              ? `
                **Был разбанен:** Да
                **Разбанен пользователем:** ${message.guild.members.cache.get(ban.unbannedBy) || 'Неизвестно'}
                **Время разбана:** ${momentToDiscordDate(moment(ban.unbannedDate))}
                ${ban.unbannedReason ? `**Причина разбана:** ${ban.unbannedReason}` : ''}`
              : ''
          }`,
          inline: true,
        })),
      )
      .setFooter({ text: `Процент увеличения времени мута: +${MemberBase.bans.length * 100}%` });

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
