import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { isNumber } from '../../utils/Common/Number';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { getMemberBaseId } from '../../utils/Other';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class RemoveWarnCommand extends Command {
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
    const targetMember = message.mentions.members.first();

    if (!targetMember) {
      const embed = ErrorEmbed('Введите пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }
    const warningNumber = Number(args[1]);

    if (!isNumber(warningNumber)) {
      const embed = ErrorEmbed('Введите номер предупреждения').setFooter({
        text: `Что бы узнать номер предупреждения пользователя введите >warns ${targetMember.user.tag}`,
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const warns = await client.service.getWarns(getMemberBaseId(targetMember));

    if (warns.length < warningNumber) {
      const embed = ErrorEmbed('У пользователя нет предупреждения под этим номером').setFooter({
        text: `Что бы узнать номер предупреждения пользователя введите >warns ${targetMember.user.tag}`,
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const warnId = warningNumber - 1;

    if (warns[warnId].removed) {
      const embed = ErrorEmbed('Предупреждение уже удалено');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
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
