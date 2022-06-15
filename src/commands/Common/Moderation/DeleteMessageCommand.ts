import { PermissionString } from 'discord.js';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class DeleteMessageCommand extends CommonCommand {
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
      const reply = message.sendError('Сообщение не найдено');
      reply.then(() => {
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
        const reply = message.sendError('Сообщение не найдено');
        reply.then(() => {
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
      const reply = message.sendError('Нет прав на удаление сообщения');
      reply.then(() => {
        setTimeout(() => {
          message.delete();
        }, 5000);
      });
      return;
    }

    fetchedMessage.delete();

    const reply = message.sendSuccess(`Сообщение от пользователя ${fetchedMessage.member} было удалено`);
    reply.then(() => {
      setTimeout(() => {
        message.delete();
      }, 5000);
    });
    return;
  }
}

export default new DeleteMessageCommand();
