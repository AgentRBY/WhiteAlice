import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class RemoveBaseVoiceChannel extends Command {
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
      const embed = ErrorEmbed('Базовой голосовой канал не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    await client.service.removeBaseVoiceChannel(message.guildId);

    const embed = SuccessEmbed(
      `Канал ${voiceChannel} удалён из списка базовых голосовых каналов для модуля Пользовательских голосовых каналов`,
    );
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new RemoveBaseVoiceChannel();
