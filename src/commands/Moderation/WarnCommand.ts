import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Warn } from '../../typings/MemberModel';
import { Emojis } from '../../static/Emojis';
import { MemberModel } from '../../models/MemberModel';

export default new Command({
  name: 'warn',
  category: 'Moderation',
  aliases: [],
  description: `Выдаёт предупреждение пользователю. 
  Каждое предупреждение даёт +5% к времени мута.
  
  Список всех предупреждений у пользователя можно посмотреть командой >warns`,
  examples: [
    {
      command: 'warn @TestUser',
      description: 'Выдаёт предупреждение пользователю TestUser',
    },
    {
      command: 'warn @TestUser Плохое поведение',
      description: 'Выдаёт предупреждение пользователю TestUser с причиной "Плохое поведение"',
    },
  ],
  usage: 'warn <пользователь> [причина]',
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args }) => {
    const member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('**Введите пользователя**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const MemberData = await MemberModel.findById(`${member.id}-${message.guildId}`);

    const reason = args.slice(1).join(' ');

    const embed = SuccessEmbed(`Пользователю ${member} было выдано предупреждение`).setTimestamp();

    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вам было выдано предупреждение пользователем ${message.author}
        Это уже ваше \`${MemberData.warns.length + 1}\` предупреждение`,
      )
      .setColor(Colors.Red)
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `Причина: ${reason}` });
      directEmbed.setFooter({ text: `Причина: ${reason}` });
    }

    const warn: Warn = {
      date: Date.now(),
      reason: reason,
      givenBy: message.member.id,
    };

    MemberData.warns.push(warn);
    await MemberData.save();

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    member.send({ embeds: [directEmbed] });
  },
});
