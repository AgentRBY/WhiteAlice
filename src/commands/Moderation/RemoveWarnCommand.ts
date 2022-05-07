import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { isNumber } from '../../utils/Number';
import { MemberModel } from '../../models/MemberModel';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';

export default new Command({
  name: 'removeWarn',
  category: 'Moderation',
  aliases: ['deleteWarn', 'delWarn', 'unWarn'],
  description: 'Позволяет удалить предупреждение у пользователя.',
  examples: [
    {
      command: 'removeWarn @TestUser 2',
      description: 'Удалить предупреждение №2 у пользователя TestUser',
    },
    {
      command: 'removeWarn @TestUser 3 Ошибочное предупреждение',
      description: 'Удалить предупреждение №3 у пользователя TestUser с причиной `Ошибочное предупреждение`',
    },
  ],
  usage: 'removeWarn <пользователь> <номер предупреждения> [причина]',
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args }) => {
    const member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('Введите пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }
    const warningNumber = Number(args[1]);

    if (!isNumber(warningNumber)) {
      const embed = ErrorEmbed('Введите номер предупреждения').setFooter({
        text: `Что бы узнать номер предупреждения пользователя введите >warns ${member.user.tag}`,
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const MemberData = await MemberModel.findById(`${member.id}-${message.guildId}`);

    if (MemberData.warns.length < warningNumber) {
      const embed = ErrorEmbed('У пользователя нет предупреждения под этим номером').setFooter({
        text: `Что бы узнать номер предупреждения пользователя введите >warns ${member.user.tag}`,
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const warningIndex = warningNumber - 1;

    if (MemberData.warns[warningIndex].removed) {
      const embed = ErrorEmbed('Предупреждение уже удалено');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const reason = args.slice(2).join(' ');

    MemberData.warns[warningIndex].removed = true;
    MemberData.warns[warningIndex].removedBy = message.author.id;
    MemberData.warns[warningIndex].removedDate = Date.now();

    if (reason) {
      MemberData.warns[warningIndex].removedReason = reason;
    }

    MemberData.save();

    const embed = SuccessEmbed(`У пользователя ${member} было снято предупреждение №${warningNumber}`);
    const directEmbed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` у Вас было снято предупреждение №${warningNumber}`,
      )
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `Причина снятия: ${reason}` });
      directEmbed.setFooter({ text: `Причина снятия: ${reason}` });
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    member.send({ embeds: [directEmbed] });
  },
});
