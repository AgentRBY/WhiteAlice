import { CommandDecorator } from './BaseDecorator';
import { CommandRunOptions } from '../../structures/Commands/CommonCommand';
import { ErrorEmbed } from '../Discord/Embed';

export function IsChannelForMusic() {
  return CommandDecorator<CommandRunOptions>(({ client, message }) => {
    if (!message.member?.voice.channel) {
      const embed = ErrorEmbed('**Вы не находитесь в голосовом канале**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!client.disTube.getQueue(message)) {
      const embed = ErrorEmbed('**Плейлист пуст**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (message.member.voice.channelId !== message.guild.me.voice.channelId) {
      const embed = ErrorEmbed('**Вы не находитесь в том же голосовом канале, что и бот**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    return true;
  });
}

export function IsQueueExist() {
  return CommandDecorator<CommandRunOptions>(({ client, message }) => {
    if (!client.disTube.getQueue(message)) {
      const embed = ErrorEmbed('**Плейлист пуст**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    return true;
  });
}

export function IsUserInVoice() {
  return CommandDecorator<CommandRunOptions>(({ message }) => {
    if (!message.member?.voice.channel) {
      const embed = ErrorEmbed('**Плейлист пуст**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    return true;
  });
}
