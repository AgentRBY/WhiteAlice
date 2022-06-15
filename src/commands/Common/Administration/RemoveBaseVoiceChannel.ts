import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class RemoveBaseVoiceChannel extends CommonCommand {
  name = 'removeBaseVoiceChannel';
  category = 'Administration';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'removeBaseVoiceChannel';

  async run({ client, message }: CommandRunOptions) {
    const voiceChannelId = await client.service.getBaseVoiceChannel(message.guildId);
    const voiceChannel = message.guild.channels.cache.get(voiceChannelId);

    if (!voiceChannel) {
      message.sendError('Базовой голосовой канал не найден');
      return;
    }

    await client.service.removeBaseVoiceChannel(message.guildId);

    message.sendSuccess(
      `Канал ${voiceChannel} удалён из списка базовых голосовых каналов для модуля Пользовательских голосовых каналов`,
    );
  }
}

export default new RemoveBaseVoiceChannel();
