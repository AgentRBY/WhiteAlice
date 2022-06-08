import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { isNumber } from '../../../utils/Common/Number';
import { VoiceChannel } from 'discord.js';

class VoiceChannelLimit extends Command {
  name = 'voiceChannelLimit';
  category = 'Voice';
  aliases = ['vcLimit'];
  description = `Установить лимит пользователей для пользовательского голосового канала
  
  Минимальный лимит - 1 человек
  Максимальный лимит - 99 человек
  
  Если ввести 0, то лимит будет убран
  
  Вместо цифры можно указать \`current\`/\`текущий\` для установки лимита равному текущему количеству пользователей в голосовом канале`;
  examples: CommandExample[] = [
    {
      command: 'vcLimit 10',
      description: 'Установить лимит в 10 пользователей',
    },
    {
      command: 'vcLimit 0',
      description: 'Убрать лимит пользователей в голосовом канале',
    },
    {
      command: 'vcLimit current',
      description: 'Установить лимит равным текущему количеству пользователей в голосовом канале',
    },
  ];
  usage = 'voiceChannelLimit <лимит|current>';

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

    let limit = Number(args[0]);

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    if (
      args[0]?.toLowerCase() === 'current' ||
      args[0]?.toLowerCase() === 'c' ||
      args[0]?.toLowerCase() === 'текущее' ||
      args[0]?.toLowerCase() === 'т'
    ) {
      limit = voiceChannel.members.size;
    }

    if (!isNumber(limit)) {
      const embed = ErrorEmbed('Введите корректное число');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (limit > 99) {
      const embed = ErrorEmbed('Лимит не может быть больше 99');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (limit < 0) {
      const embed = ErrorEmbed('Лимит не может быть меньше 0');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (limit === 0) {
      voiceChannel.setUserLimit(0);

      const embed = SuccessEmbed('Лимит пользователей в голосовом канале убран');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    voiceChannel.setUserLimit(limit);

    const embed = SuccessEmbed(`Лимит пользователей в голосовом канале установлен на ${limit}`);
    embed.setFooter({ text: `Подсказка: что бы убрать лимит пропишите >${this.name} 0` });
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new VoiceChannelLimit();
