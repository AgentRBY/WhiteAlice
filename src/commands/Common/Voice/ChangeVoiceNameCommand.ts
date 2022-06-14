import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
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
