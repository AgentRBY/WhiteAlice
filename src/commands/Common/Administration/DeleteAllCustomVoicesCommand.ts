import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { PermissionString, VoiceChannel } from 'discord.js';

class DeleteAllCustomVoices extends CommonCommand {
  name = 'deleteAllCustomVoices';
  category = 'Administration';
  aliases = [];
  description = 'Удаляет ВСЕ каналы в той же категории, что и базовый голосовой канал';
  examples: CommandExample[] = [];
  usage = 'deleteAllCustomVoices';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message }: CommandRunOptions) {
    const voiceChannelId = await client.service.getBaseVoiceChannel(message.guildId);
    const voiceChannel = message.guild.channels.cache.get(voiceChannelId) as VoiceChannel;

    if (!voiceChannel) {
      message.sendError('Базовой голосовой канал не найден');
      return;
    }

    const channels = voiceChannel.parent.children.filter((channel) => channel.id !== voiceChannelId);

    channels.forEach(async (channel) => {
      await channel.delete();
    });

    message.sendSuccess('Все кастомные голосовые каналы удалены');
    return;
  }
}

export default new DeleteAllCustomVoices();
