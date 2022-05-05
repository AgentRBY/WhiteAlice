import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MemberModel } from '../../models/MemberModel';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { Colors } from '../../static/Colors';
import { momentToDiscordDate } from '../../utils/Date';

export default new Command({
  name: 'warns',
  category: 'Moderation',
  aliases: [],
  description: 'Выводит список всех предупреждений пользователя.',
  examples: [
    {
      command: 'warns @TestUser',
      description: 'Выводит список всех предупреждений пользователя TestUser.',
    },
  ],
  usage: 'warn [пользователь]',
  run: async ({ message }) => {
    const member = message.mentions.members.first() || message.member;

    const MemberBase = await MemberModel.findById(`${member.id}-${message.guild.id}`);

    if (!MemberBase) {
      const embed = ErrorEmbed('Пользователь не найден в базе');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!MemberBase.warns.length) {
      const embed = SuccessEmbed('Предупреждения отсутствуют');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .addFields(
        MemberBase.warns.map((warn, index) => ({
          name: `Предупреждение №${index + 1}`,
          value: `**Выдан:** ${message.guild.members.cache.get(warn.givenBy) || 'Неизвестно'}
                **Причина:** ${warn.reason || 'Отсутствует'}
                **Время:** ${momentToDiscordDate(moment(warn.date))}`,
          inline: true,
        })),
      )
      .setFooter({ text: `Процент увеличения времени мута: +${MemberBase.warns.length * 5}%` });

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
