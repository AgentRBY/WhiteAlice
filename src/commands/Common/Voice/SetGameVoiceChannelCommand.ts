import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { VoiceChannel } from 'discord.js';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';

class SetGameVoiceChannel extends CommonCommand {
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

  @IsCustomVoice()
  async run({ message }: CommandRunOptions) {
    const userActivity = message.member.presence?.activities[0];

    if (!userActivity) {
      message.sendError('Вы не находитесь в игре или не слушаете музыку');
      return;
    }

    let activityName: string;

    switch (userActivity.type) {
      case 'PLAYING': {
        activityName = '🎮 Играем в';
        break;
      }
      case 'LISTENING': {
        activityName = '🎧 Слушаем';
        break;
      }
      case 'WATCHING': {
        activityName = '💻 Смотрим';
        break;
      }
      case 'STREAMING': {
        activityName = '🎥 Стримим';
        break;
      }
      case 'COMPETING': {
        activityName = '🔪 Сражаемся в';
        break;
      }
      default: {
        activityName = '🎮 Играем в';
        break;
      }
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    const channelName = `${activityName} ${userActivity.name}`;
    voiceChannel.setName(channelName);

    message.sendSuccess(`Имя канала установлено как \`${channelName}\``);
    return;
  }
}

export default new SetGameVoiceChannel();
