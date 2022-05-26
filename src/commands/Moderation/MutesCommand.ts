import { SuccessEmbed } from '../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { Colors } from '../../static/Colors';
import { momentToDiscordDate } from '../../utils/Common/Date';
import { getMemberBaseId } from '../../utils/Other';
import { Command, CommandRunOptions } from '../../structures/Command';

class MutesCommand extends Command {
  name = 'mutes';
  category = 'Moderation';
  aliases = [];
  description = 'Выводит список всех мутов пользователя';
  examples = [
    {
      command: 'mutes @TestUser',
      description: 'Выводит список всех мутов пользователя TestUser.',
    },
  ];
  usage = 'mutes [пользователь]';

  async run({ client, message }: CommandRunOptions) {
    const targetMember = message.mentions.members.first() || message.member;

    const mutes = await client.service.getMutes(getMemberBaseId(targetMember));

    if (!mutes.length) {
      const embed = SuccessEmbed('Муты отсутствуют');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = new MessageEmbed().setColor(Colors.Blue).addFields(
      mutes.map((mute, index) => ({
        name: `Мут №${index + 1}`,
        value: `**Выдан:** ${message.guild.members.cache.get(mute.givenBy) || 'Неизвестно'}
                **Причина:** ${mute.reason || 'Отсутствует'}
                **Выдан:** ${momentToDiscordDate(moment(mute.date))}
                **Истекает:** ${momentToDiscordDate(moment(mute.time + mute.date))}
                ${
                  mute.unmuted
                    ? `
                **Был размучен:** Да
                **Размучен пользователем:** ${message.guild.members.cache.get(mute.unmutedBy) || 'Неизвестно'}
                **Время размута:** ${momentToDiscordDate(moment(mute.unmutedDate))}
                ${mute.unmutedReason ? `**Причина размута:** ${mute.unmutedReason}` : ''}`
                    : ''
                }`,
        inline: true,
      })),
    );

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new MutesCommand();
