import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { VoiceChannel } from 'discord.js';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';

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
  async run({ message, args }: CommandRunOptions) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const userId = member?.id;

    if (!userId) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (userId === message.author.id) {
      const embed = ErrorEmbed('Вы не можете кикнуть себя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    if (!voiceChannel.members.get(userId)) {
      const embed = ErrorEmbed('Пользователь не находится в текущем голосовом канале');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    member.voice.disconnect(`Kicked from custom voice by ${message.member.displayName}`);

    const embed = SuccessEmbed(`Пользователь ${member} был кикнут из голосового канала`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new VoiceChannelKick();
