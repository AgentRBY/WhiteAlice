import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { KARMA_FOR_WARN } from '../../../static/Punishment';
import { getMemberBaseId } from '../../../utils/Other';
import { Warn } from '../../../typings/MemberModel';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getMemberFromMessage } from '../../../utils/Discord/Users';

class WarnCommand extends CommonCommand {
  name = 'warn';
  category = 'Moderation';
  aliases = [];
  description = `Выдаёт предупреждение пользователю. 
  Каждое предупреждение даёт +${KARMA_FOR_WARN} кармы.
  
  Список всех предупреждений у пользователя можно посмотреть командой >warns`;
  examples: CommandExample[] = [
    {
      command: 'warn @TestUser',
      description: 'Выдаёт предупреждение пользователю TestUser',
    },
    {
      command: 'warn @TestUser Плохое поведение',
      description: 'Выдаёт предупреждение пользователю TestUser с причиной "Плохое поведение"',
    },
  ];
  usage = 'warn <пользователь> [причина]';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message);

    if (!targetMember) {
      message.sendError('**Пользователь не найден**');
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
  }
}

export default new WarnCommand();
