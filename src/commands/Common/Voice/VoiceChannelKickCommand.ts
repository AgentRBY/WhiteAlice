import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { VoiceChannel } from 'discord.js';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';
import { getMemberFromMessage } from '../../../utils/Discord/Users';

class VoiceChannelKick extends CommonCommand {
  name = 'voiceChannelKick';
  category = 'Voice';
  aliases = ['vcKick'];
  description = 'Кикнуть пользователя из пользовательского голосового канала';
  examples: CommandExample[] = [
    {
      command: 'vcKick @TestUser',
      description: 'Кикнуть пользователя @TestUser из голосового канала',
    },
    {
      command: 'vcKick 890221442266959872',
      description: 'Кикнуть пользователя с айди 890221442266959872 из голосового канала',
    },
  ];
  usage = 'voiceChannelKick <пользователь>';

  @IsCustomVoice()
  async run({ message }: CommandRunOptions) {
    const member = getMemberFromMessage(message);
    const userId = member?.id;

    if (!userId) {
      message.sendError('Пользователь не найден');
      return;
    }

    if (userId === message.author.id) {
      message.sendError('Вы не можете кикнуть себя');
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    if (!voiceChannel.members.get(userId)) {
      message.sendError('Пользователь не находится в текущем голосовом канале');
      return;
    }

    member.voice.disconnect(`Kicked from custom voice by ${message.member.displayName}`);

    message.sendSuccess(`Пользователь ${member} был кикнут из голосового канала`);
    return;
  }
}

export default new VoiceChannelKick();
