import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Warn } from '../../typings/MemberModel';
import { Emojis } from '../../static/Emojis';
import { client } from '../../app';
import { getMemberBaseId } from '../../utils/Other';
import { KARMA_FOR_WARN } from '../../static/Punishment';

export default new Command({
  name: 'warn',
  category: 'Moderation',
  aliases: [],
  description: `Выдаёт предупреждение пользователю. 
  Каждое предупреждение даёт +${KARMA_FOR_WARN} кармы.
  
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
    const targetMember = message.mentions.members.first();

    if (!targetMember) {
      const embed = ErrorEmbed('**Введите пользователя**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    const reason = args.slice(1).join(' ');

    const embed = SuccessEmbed(`Пользователю ${targetMember} было выдано предупреждение`).setTimestamp();

    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вам было выдано предупреждение пользователем ${message.author}
        Это уже ваше \`${warns.length + 1}\` предупреждение`,
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

    client.service.addWarn(getMemberBaseId(targetMember), warn);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    targetMember.send({ embeds: [directEmbed] });
  },
});
