import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { Message, MessageEmbed, VoiceChannel } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { IsCustomVoice } from '../../../utils/Decorators/VoiceDecorators';

export class LockVoiceChannel extends CommonCommand {
  name = 'lockVoiceChannel';
  category = 'Voice';
  aliases = ['vcLock'];
  description = `Закрыть пользовательский голосовой канал. Повторное использование команды открывает канал обратно
  
  Имеет альтернативу в виде кнопки в первом сообщении текстового канал пользовательского голосового канала.`;
  examples: CommandExample[] = [
    {
      command: 'vhLock',
      description: 'Закрыть голосовой канал',
    },
  ];
  usage = 'lockVoiceChannel';

  @IsCustomVoice()
  async run({ message }: CommandRunOptions) {
    LockVoiceChannel.changeChannelLockStatus(message);
  }

  public static changeChannelLockStatus(message: Message) {
    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId) as VoiceChannel;

    const isUnlocked = !voiceChannel.permissionsFor(message.guild.id).has('CONNECT');

    voiceChannel.permissionOverwrites.edit(message.guild.id, {
      CONNECT: isUnlocked,
    });

    const embed = new MessageEmbed()
      .setColor(Colors.Green)
      .setDescription(`${isUnlocked ? '🔒' : '🔓'} Голосовой канал **${isUnlocked ? 'открыт' : 'закрыт'}**`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new LockVoiceChannel();
