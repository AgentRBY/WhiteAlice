import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { MemberModel } from '../../models/MemberModel';
import { Ban } from '../../typings/MemberModel';
import { isNumber } from '../../utils/Number';
import { client } from '../../app';

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
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const userId = args[0] || member?.id;

    if (!userId) {
      const embed = ErrorEmbed('Введите пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    await message.guild.bans.fetch();
    if (message.guild.bans.cache.get(userId)) {
      const embed = ErrorEmbed('Пользователь уже в бане');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (member && !member.bannable) {
      const embed = ErrorEmbed('У меня нет прав, что бы забанить этого пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (member?.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) {
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

    let MemberData = await MemberModel.findById(`${userId}-${message.guildId}`);

    if (!MemberData) {
      MemberData = await MemberModel.create({
        _id: `${userId}-${message.guildId}`,
      });
      await MemberData.save();
    }

    const reason = args.slice(1).join(' ');

    const user = await client.users.fetch(userId);

    const embed = SuccessEmbed(`Пользователь ${member || user} был забанен`);
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

    await (member || user).send({ embeds: [directEmbed] }).catch(() => {});
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

    message.guild.bans.create(userId, {
      reason,
      days: messageDeleteCountInDays,
    });
  },
});
