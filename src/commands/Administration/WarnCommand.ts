import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Warn } from '../../typings/MemberModel';
import { Emojis } from '../../static/Emojis';

export default new Command({
  name: 'warn',
  category: 'Administration',
  aliases: [],
  description: '',
  examples: [],
  usage: 'warn',
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args, MemberData }) => {
    let member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('**Введите пользователя**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const reason = args.slice(1).join(' ');

    const embed = SuccessEmbed(`Пользователю ${member} было выдано предупреждение`).setTimestamp();

    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вам было выдано предупреждение пользователем ${message.author}
        Это уже ваше \`${MemberData.warns.length}\` предупреждение`,
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
