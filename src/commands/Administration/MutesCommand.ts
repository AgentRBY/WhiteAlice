import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MemberModel } from '../../models/MemberModel';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { Colors } from '../../static/Colors';
import { momentToDiscordDate } from '../../utils/Date';

export default new Command({
  name: 'mutes',
  category: 'Administration',
  aliases: [],
  description: 'Выводит список всех мутов пользователя',
  examples: [
    {
      command: 'mutes @TestUser',
      description: 'Выводит список всех мутов пользователя TestUser.',
    },
  ],
  usage: 'mutes [пользователь]',
  run: async ({ message }) => {
    const member = message.mentions.members.first() || message.member;

    const MemberBase = await MemberModel.findById(`${member.id}-${message.guild.id}`);

    if (!MemberBase) {
      const embed = ErrorEmbed('Пользователь не найден в базе');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!MemberBase.mutes.length) {
      const embed = SuccessEmbed('Муты отсутствуют');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = new MessageEmbed().setColor(Colors.Blue).addFields(
      MemberBase.mutes.map((mute, index) => ({
        name: `Мут №${index + 1}`,
        value: `**Выдан:** ${message.guild.members.cache.get(mute.givenBy) || 'Неизвестно'}
                **Причина:** ${mute.reason || 'Отсутствует'}
                **Выдан:** ${momentToDiscordDate(moment(mute.date))}
                **Истекает:** ${momentToDiscordDate(moment(mute.time + mute.date))}
                ${mute.unmuted ? '**Был размучен:** Да' : ''}`,
        inline: true,
      })),
    );

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
