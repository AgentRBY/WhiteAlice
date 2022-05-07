import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { MemberModel } from '../../models/MemberModel';
import { Ban } from '../../typings/MemberModel';
import { isNumber } from '../../utils/Number';

export default new Command({
  name: 'ban',
  category: 'Moderation',
  aliases: [],
  description: `Выдаёт бан пользователю
  Каждый бан добавляет +100% к времени мута
  
  Можно очистить сообщения пользователя за последние пару дней (от 1 до 7) добавив ключ hl:D
  
  Список всех банов у пользователя можно просмотреть командой >bans`,
  examples: [
    {
      command: 'ban @TestUser',
      description: 'Забанить пользователя @TestUser',
    },
    {
      command: 'ban @TestUser Плохой человек',
      description: 'Забанить пользователя @TestUser с причиной `Плохой человек`',
    },
    {
      command: 'ban @TestUser hl:D 6',
      description: 'Забанить пользователя @TestUser и удалить его сообщения за последние 5 дней',
    },
  ],
  usage: 'ban <пользователь> [причина]',
  memberPermissions: ['BAN_MEMBERS'],
  botPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args, keys }) => {
    const member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('Введите пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    await message.guild.bans.fetch();
    if (message.guild.bans.cache.get(member.id)) {
      const embed = ErrorEmbed('Пользователь уже в бане');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!member.bannable) {
      const embed = ErrorEmbed('У меня нет прав, что бы забанить этого пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
      const embed = ErrorEmbed('У вас нет прав, что бы замутить этого пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    let messageDeleteCountInDays = 0;

    if (keys.has('hl:D') || keys.has('hl:d')) {
      messageDeleteCountInDays = Number(keys.get('hl:D') || keys.get('hl:d'));

      if (!isNumber(messageDeleteCountInDays) || messageDeleteCountInDays < 0 || messageDeleteCountInDays > 7) {
        const embed = ErrorEmbed('Количество дней введено неправильно').setFooter({
          text: 'Количество дней должно быть от 1 до 7',
        });
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }
    }

    const MemberData = await MemberModel.findById(`${member.id}-${message.guildId}`);

    const reason = args.slice(1).join(' ');

    const embed = SuccessEmbed(`Пользователь ${member} был забанен`);
    const directEmbed = new MessageEmbed()
      .setColor(Colors.Red)
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вы получили бан от пользователя ${message.author}`,
      )
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `Причина: ${reason}` });
      directEmbed.setFooter({ text: `Причина: ${reason}` });
    }

    const ban: Ban = {
      date: Date.now(),
      reason,
      givenBy: message.member.id,
      messageDeleteCountInDays,
    };

    MemberData.bans.push(ban);
    MemberData.save();

    await member.send({ embeds: [directEmbed] });
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

    member.ban({
      reason,
      days: messageDeleteCountInDays,
    });
  },
});
