import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class SetBaseVoiceChannel extends Command {
  name = 'setBaseVoiceChannel';
  category = 'Administration';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'setBaseVoiceChannel';

  async run({ client, message, args }: CommandRunOptions) {
    const channelID = message.mentions.channels.first()?.id || args[0];

    if (!channelID) {
      const embed = ErrorEmbed('Введите айди голосового канала');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(channelID);

    if (!voiceChannel) {
      const embed = ErrorEmbed('Канала с таким айди не существует');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (voiceChannel.type !== 'GUILD_VOICE') {
      const embed = ErrorEmbed('Неверный тип канала. Укажите голосовой канал');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (await client.service.isBaseVoiceChannel(message.guildId, channelID)) {
      const embed = ErrorEmbed('Канал уже добавлен');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    await client.service.setBaseVoiceChannel(message.guildId, channelID);

    const embed = SuccessEmbed(
      `Канал ${voiceChannel} добавлен как базовый голосовой канал для модуля Пользовательских голосовых каналов`,
    );
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new SetBaseVoiceChannel();
