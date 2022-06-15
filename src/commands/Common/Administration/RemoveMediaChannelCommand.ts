import { PermissionString } from 'discord.js';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class RemoveMediaChannelCommand extends CommonCommand {
  name = 'removeMediaChannel';
  category = 'Administration';
  aliases = ['removeFromMediaChannels'];
  description = 'Удаляет канал из списка Каналов только для медиа контента';
  examples: CommandExample[] = [
    {
      command: 'removeMediaChannel 910989430557392947',
      description: 'Удалить канал с айди 910989430557392947 из списка Каналов только для медиа контента',
    },
  ];
  usage = 'removeMediaChannel <айди>';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
    const channelId = args[0];

    if (!channelId) {
      message.sendError('Укажите айди канала');
      return;
    }

    if (!(await client.service.isMediaChannel(message.guildId, channelId))) {
      message.sendError('Канал не найдено в списке Каналов только для медиа контента');
      return;
    }

    client.service.removeMediaChannel(message.guildId, channelId);

    message.sendSuccess('Канал удален из списка Каналов только для медиа контента');
    return;
  }
}

export default new RemoveMediaChannelCommand();
