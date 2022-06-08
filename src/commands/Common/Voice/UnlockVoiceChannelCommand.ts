import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed, VoiceChannel } from 'discord.js';
import { Colors } from '../../../static/Colors';

class UnlockVoiceChannel extends Command {
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

export default new UnlockVoiceChannel();
