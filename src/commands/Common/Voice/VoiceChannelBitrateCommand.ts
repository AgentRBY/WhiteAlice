import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { isNumber } from '../../../utils/Common/Number';
import { VoiceChannel } from 'discord.js';

class VoiceChannelBitrate extends Command {
  name = 'voiceChannelBitrate';
  category = 'Voice';
  aliases = ['vcBitrate'];
  description = `Устанавливает битрейт пользовательского голосового канала
  
  Минимальный битрейт: 8 Кбит/с.
  Максимальный битрейт зависит от уровня сервера:
  Нет уровня: 96 Кбит/с
  Первый уровень: 128 Кбит/с
  Второй уровень: 256 Кбит/с
  Третий уровень: 384 Кбит/с
  
  Вместо значения можно указать:
  - max (для установки максимального битрейта)
  - min (для установки минимального битрейта - 8 Кбит/с)
  - reset (для установки битрейта по умолчанию - 64 Кбит/с)
  
  Имеет альтернативу в виде кнопки в первом сообщении текстового канал пользовательского голосового канала (только для установки максимального битрейта)`;
  examples: CommandExample[] = [
    {
      command: 'vcBitrate 80',
      description: 'Устанавливает битрейт на 80 Кбит/с',
    },
    {
      command: 'vcBitrate max',
      description: 'Устанавливает максимальный битрейт для данного сервера',
    },
    {
      command: 'vcBitrate min',
      description: 'Устанавливает минимальный битрейт (8 Кбит/с)',
    },
  ];
  usage = 'voiceChannelBitrate <битрейт|max|min|reset>';

  async run({ client, message, args }: CommandRunOptions) {
    if (!message.member.voice.channelId) {
      const embed = ErrorEmbed('Вы не находитесь в голосовом канале');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const customVoiceChannelInfo = client.customVoicesState.get(message.member.voice.channelId);

    if (!customVoiceChannelInfo) {
      const embed = ErrorEmbed('Это не пользовательский голосовой канал');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (customVoiceChannelInfo[0] !== message.member.id) {
      const embed = ErrorEmbed('Вы не являетесь автором этого голосового канала');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const maxBitrate = message.guild.maximumBitrate;

    let bitrate = Number(args[0]);

    if (args[0] === 'max') {
      bitrate = maxBitrate / 1000;
    }

    if (args[0] === 'min') {
      bitrate = 8;
    }

    if (args[0] === 'reset') {
      bitrate = 64;
    }

    if (!isNumber(bitrate)) {
      const embed = ErrorEmbed('Введите корректный битрейт');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (bitrate * 1000 > maxBitrate) {
      const embed = ErrorEmbed(`Битрейт не может быть установлен больше чем ${maxBitrate / 1000}`);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (bitrate < 8) {
      const embed = ErrorEmbed('Битрейт не может быть меньше 8');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    voiceChannel.setBitrate(bitrate * 1000);

    const embed = SuccessEmbed(`Битрейт голосового канала установлен на ${bitrate} Кбит/с`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new VoiceChannelBitrate();
