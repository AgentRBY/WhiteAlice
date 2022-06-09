import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { formatDays, momentToDiscordDate } from '../../../utils/Common/Date';
import moment from 'moment';
import { getMemberBaseId } from '../../../utils/Other';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class BansCommand extends CommonCommand {
  name = 'bans';
  category = 'Moderation';
  aliases = [];
  description = 'Выводит список всех банов у пользователя';
  examples: CommandExample[] = [
    {
      command: '>bans @TestUser',
      description: 'Выводит список всех банов у пользователя TestUser',
    },
  ];
  usage = 'bans [пользователь]';

  async run({ client, message }: CommandRunOptions) {
    const member = message.mentions.members.first() || message.member;

    const bans = await client.service.getBans(getMemberBaseId(member));

    if (!bans.length) {
      const embed = SuccessEmbed('Баны отсутствуют');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .addFields(
        bans.map((ban, index) => ({
          name: `Бан №${index + 1}`,
          value: `**Выдан:** ${message.guild.members.cache.get(ban.givenBy) || 'Неизвестно'}
                **Причина:** ${ban.reason || 'Отсутствует'}
                **Время:** ${momentToDiscordDate(moment(ban.date))}${
            ban.messageDeleteCountInDays
              ? `\n**Было удалено сообщений:** За последни${
                  ban.messageDeleteCountInDays === 1 ? 'й' : 'е'
                } ${formatDays(ban.messageDeleteCountInDays)}`
              : ''
          }${
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
      .setFooter({ text: `Карма за баны: ${await client.service.calculateBansKarma(getMemberBaseId(member))}` });

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new BansCommand();
