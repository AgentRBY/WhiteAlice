import { PermissionString } from 'discord.js';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class SetMediaChannelCommand extends CommonCommand {
  name = 'setMediaChannel';
  category = 'Administration';
  aliases = ['addToMediaChannels'];
  description = 'Добавляет канал в список Каналов только для медиа контента';
  examples: CommandExample[] = [
    {
      command: 'setMediaChannel 910989430557392947',
      description: 'Добавить канал с айди 910989430557392947 в список Каналов только для медиа контента',
    },
  ];
  usage = 'setMediaChannel <айди>';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
    const channelId = args[0];

    if (!channelId) {
      message.sendError('Укажите айди канала');
      return;
    }

    if (!message.guild.channels.cache.has(channelId)) {
      message.sendError('Канала с таким айди не существует');
      return;
    }

    if (message.guild.channels.cache.get(channelId).type !== 'GUILD_TEXT') {
      message.sendError('Неверный тип канала. Укажите текстовый канал');
      return;
    }

    if (await client.service.isMediaChannel(message.guildId, channelId)) {
      message.sendError('Канал уже добавлен');
      return;
    }

    client.service.setMediaChannel(message.guildId, channelId);

    message.sendSuccess(`Канал <#${channelId}> добавлен как Канал только для медиа контента`);
    return;
  }
}

export default new SetMediaChannelCommand();
