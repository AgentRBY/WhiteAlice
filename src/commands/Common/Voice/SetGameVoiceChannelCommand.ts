import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { VoiceChannel } from 'discord.js';

class SetGameVoiceChannel extends Command {
  name = 'setGameVoiceChannel';
  category = 'Voice';
  aliases = ['vcGame'];
  description = `Устанавливает канал как игровой. 
  
  Если вы играете в игру, то канал будет переименован как \`🎮 Играем в (название игры)\`
  Если вы слушаете музыку, то канал будет переименован как \`🎧 Слушаем Spotify\`
  Если вы стримите (на твиче, например), то канал будет переименован как \`🎥 Стримим (название стрима)\`. Не работает со стримами в дискорде
  Если вы смотрите YouTube через средства дискорда, то канал будет переименован как \`💻 Смотрим YouTube\`
  Если вы играете в игру, которая поддерживает сражения (функция дискорда), то канал будет переименован как \`🔪 Сражаемся в (название игры)\`
  
  Имеет альтернативу в виде кнопки в первом сообщении текстового канал пользовательского голосового канала.
  `;
  examples: CommandExample[] = [
    {
      command: 'vhGame',
      description: 'Устанавливает канал как игровой',
    },
  ];
  usage = 'setGameVoiceChannel';

  async run({ client, message }: CommandRunOptions) {
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

    const userActivity = message.member.presence?.activities[0];

    if (!userActivity) {
      const embed = ErrorEmbed('Вы не находитесь в игре или не слушаете музыку');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    let activityName: string;

    switch (userActivity.type) {
      case 'PLAYING':
        activityName = '🎮 Играем в';
        break;
      case 'LISTENING':
        activityName = '🎧 Слушаем';
        break;
      case 'WATCHING':
        activityName = '💻 Смотрим';
        break;
      case 'STREAMING':
        activityName = '🎥 Стримим';
        break;
      case 'COMPETING':
        activityName = '🔪 Сражаемся в';
        break;
      default:
        activityName = '🎮 Играем в';
        break;
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    const channelName = `${activityName} ${userActivity.name}`;
    voiceChannel.setName(channelName);

    const embed = SuccessEmbed(`Имя канала установлено как \`${channelName}\``);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new SetGameVoiceChannel();
