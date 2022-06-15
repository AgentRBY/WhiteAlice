import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class SetBaseVoiceChannel extends CommonCommand {
  name = 'setBaseVoiceChannel';
  category = 'Administration';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'setBaseVoiceChannel';

  async run({ client, message, args }: CommandRunOptions) {
    const channelID = message.mentions.channels.first()?.id || args[0];

    if (!channelID) {
      message.sendError('Введите айди голосового канала');
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(channelID);

    if (!voiceChannel) {
      message.sendError('Канала с таким айди не существует');
      return;
    }

    if (voiceChannel.type !== 'GUILD_VOICE') {
      message.sendError('Неверный тип канала. Укажите голосовой канал');
      return;
    }

    if (await client.service.isBaseVoiceChannel(message.guildId, channelID)) {
      message.sendError('Канал уже добавлен');
      return;
    }

    await client.service.setBaseVoiceChannel(message.guildId, channelID);

    message.sendSuccess(
      `Канал ${voiceChannel} добавлен как базовый голосовой канал для модуля Пользовательских голосовых каналов`,
    );
  }
}

export default new SetBaseVoiceChannel();
