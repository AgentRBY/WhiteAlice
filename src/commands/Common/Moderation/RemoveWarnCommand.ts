import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { isNumber } from '../../../utils/Common/Number';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { getMemberBaseId } from '../../../utils/Other';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getMemberFromMessage } from '../../../utils/Discord/Users';

class RemoveWarnCommand extends CommonCommand {
  name = 'removeWarn';
  category = 'Moderation';
  aliases = ['deleteWarn', 'delWarn', 'unWarn'];
  description = 'Позволяет удалить предупреждение у пользователя.';
  examples: CommandExample[] = [
    {
      command: 'removeWarn @TestUser 2',
      description: 'Удалить предупреждение №2 у пользователя TestUser',
    },
    {
      command: 'removeWarn @TestUser 3 Ошибочное предупреждение',
      description: 'Удалить предупреждение №3 у пользователя TestUser с причиной `Ошибочное предупреждение`',
    },
  ];
  usage = 'removeWarn <пользователь> <номер предупреждения> [причина]';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message);

    if (!targetMember) {
      message.sendError('Введите пользователя');
      return;
    }
    const warningNumber = Number(args[1]);

    if (!isNumber(warningNumber)) {
      message.sendError('Введите номер предупреждения', {
        footer: {
          text: `Что бы узнать номер предупреждения пользователя введите >warns ${targetMember.user.tag}`,
        },
      });
      return;
    }

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    if (warns.length < warningNumber) {
      message.sendError('У пользователя нет предупреждения под этим номером', {
        footer: {
          text: `Что бы узнать номер предупреждения пользователя введите >warns ${targetMember.user.tag}`,
        },
      });
      return;
    }

    const warnId = warningNumber - 1;

    if (warns[warnId].removed) {
      message.sendError('Предупреждение уже удалено');
      return;
    }

    const reason = args.slice(2).join(' ');

    client.service.removeWarn(getMemberBaseId(targetMember), warnId, message.author.id, reason);

    const embed = SuccessEmbed(`У пользователя ${targetMember} было снято предупреждение №${warningNumber}`);
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
    targetMember.send({ embeds: [directEmbed] });
  }
}

export default new RemoveWarnCommand();
