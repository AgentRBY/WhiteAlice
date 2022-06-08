import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { PermissionString } from 'discord.js';
import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';

class DeleteMessageCommand extends Command {
  name = 'deleteMessage';
  category = 'Moderation';
  aliases = ['dmsg', 'delete'];
  description = 'Удаляет сообщение по айди';
  examples: CommandExample[] = [
    {
      command: 'deleteMessage 948518420524187648',
      description: 'Удаляет сообщение с айди 948518420524187648',
    },
  ];
  usage = 'deleteMessage <айди>';
  botPermissions: PermissionString[] = ['MANAGE_MESSAGES'];
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ message, args }: CommandRunOptions) {
    const messageId = args[0];

    if (!messageId) {
      const embed = ErrorEmbed('Сообщение не найдено');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then(() => {
        setTimeout(() => {
          message.delete();
        }, 5000);
      });
      return;
    }

    const fetchedMessage = await message.channel.messages
      .fetch(messageId)
      .then((m) => m)
      .catch(() => {
        const embed = ErrorEmbed('Сообщение не найдено');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then(() => {
          setTimeout(() => {
            message.delete();
          }, 5000);
        });
        return;
      });

    if (!fetchedMessage) {
      return;
    }

    if (!fetchedMessage.deletable) {
      const embed = ErrorEmbed('Нет прав на удаление сообщения');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then(() => {
        setTimeout(() => {
          message.delete();
        }, 5000);
      });
      return;
    }

    fetchedMessage.delete();

    const embed = SuccessEmbed(`Сообщение от пользователя ${fetchedMessage.member} было удалено`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then(() => {
      setTimeout(() => {
        message.delete();
      }, 5000);
    });
    return;
  }
}

export default new DeleteMessageCommand();
