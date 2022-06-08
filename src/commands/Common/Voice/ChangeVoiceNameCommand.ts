import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class ChangeVoiceNameCommand extends Command {
  name = 'changeVoiceName';
  category = 'Voice';
  aliases = ['vcChangeName'];
  description = 'Изменить имя пользовательского голосового канала. Имя не может быть длиннее 100 символов';
  examples: CommandExample[] = [
    {
      command: 'vcChangeName Крутой голосовой канал',
      description: 'Изменить имя голосового канала на Крутой голосовой канал',
    },
  ];
  usage = 'changeVoiceName <имя>';

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

    const name = args.join(' ');

    if (!name) {
      const embed = ErrorEmbed('Укажите новое имя голосового канала');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (name.length > 100) {
      const embed = ErrorEmbed('Имя голосового канала не может быть длиннее 100 символов');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const voiceChannel = message.guild.channels.cache.get(message.member.voice.channelId);

    voiceChannel.setName(name);

    const embed = SuccessEmbed(`Имя голосового канала ${voiceChannel} изменено на **${name}**`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new ChangeVoiceNameCommand();
