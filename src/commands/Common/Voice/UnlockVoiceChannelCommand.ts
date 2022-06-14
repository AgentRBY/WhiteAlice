import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';
import { LockVoiceChannel } from './LockVoiceChannelCommand';

class UnlockVoiceChannel extends CommonCommand {
  name = 'unlockVoiceChannel';
  category = 'Voice';
  aliases = ['vcUnlock'];
  description = `Открыть пользовательский голосовой канал. Повторное использование команды закроет канал обратно
  
  Имеет альтернативу в виде кнопки в первом сообщении текстового канал пользовательского голосового канала.`;
  examples: CommandExample[] = [
    {
      command: 'vcUnlock',
      description: 'Открыть голосовой канал',
    },
  ];
  usage = 'unlockVoiceChannel';

  @IsCustomVoice()
  async run({ message }: CommandRunOptions) {
    LockVoiceChannel.changeChannelLockStatus(message);
  }
}

export default new UnlockVoiceChannel();
