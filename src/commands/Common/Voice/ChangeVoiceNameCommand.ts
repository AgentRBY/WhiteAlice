import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';

class ChangeVoiceNameCommand extends CommonCommand {
  name = 'changeVoiceName';
  category = 'Voice';
  aliases = ['vcChangeName', 'vcName'];
  description = 'Изменить имя пользовательского голосового канала. Имя не может быть длиннее 100 символов';
  examples: CommandExample[] = [
    {
      command: 'vcChangeName Крутой голосовой канал',
      description: 'Изменить имя голосового канала на Крутой голосовой канал',
    },
  ];
  usage = 'changeVoiceName <имя>';

  @IsCustomVoice()
  async run({ message, args }: CommandRunOptions) {
    const name = args.join(' ');

    if (!name) {
      message.sendError('Укажите новое имя голосового канала');
      return;
    }

    if (name.length > 100) {
      message.sendError('Имя голосового канала не может быть длиннее 100 символов');
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId);

    voiceChannel.setName(name);

    message.sendSuccess(`Имя голосового канала ${voiceChannel} изменено на **${name}**`);
    return;
  }
}

export default new ChangeVoiceNameCommand();
