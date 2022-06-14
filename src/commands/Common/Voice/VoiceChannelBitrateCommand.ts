import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { isNumber } from '../../../utils/Common/Number';
import { VoiceChannel } from 'discord.js';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';

class VoiceChannelBitrate extends CommonCommand {
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

  @IsCustomVoice()
  async run({ message, args }: CommandRunOptions) {
    const maxBitrate = message.guild.maximumBitrate;

    let bitrate = Number(args[0]);

    switch (args[0]) {
      case 'max':
        bitrate = maxBitrate / 1000;
        break;
      case 'min':
        bitrate = 8;
        break;
      case 'reset':
        bitrate = 64;
        break;
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
