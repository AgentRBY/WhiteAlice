import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';
import { isNumber } from '../../../utils/Common/Number';

class RemoveSongCommand extends CommonCommand {
  name = 'removeSong';
  category = 'Music';
  aliases = ['rs', 'deleteSong'];
  description = 'Позволяет убрать песню по номеру. Номер песни можно узнать в команде >queue';
  examples: CommandExample[] = [
    {
      command: '>removeSong 3',
      description: 'Удаляет 3ю песню из плейлиста',
    },
  ];
  usage = 'removeSong';

  @IsChannelForMusic()
  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (queue.songs.length === 1) {
      const embed = ErrorEmbed('**Нечего удалять**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const songId = Number(args[0]);

    if (!isNumber(songId)) {
      const embed = ErrorEmbed('**Введите айди трека**');
      embed.setFooter({
        text: 'Подсказка: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue',
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (songId <= 0 || songId > queue.songs.length) {
      const embed = ErrorEmbed('**Песни под данным айди не найдено**');
      embed.setFooter({
        text: 'Подсказка: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue',
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const deletedSong = queue.songs.splice(songId - 1, 1)[0];

    const embed = SuccessEmbed(`**Песня \`${deletedSong.name}\` - \`${deletedSong.uploader.name}\` удалена**`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new RemoveSongCommand();
