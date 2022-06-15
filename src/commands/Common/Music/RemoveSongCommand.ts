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
      message.sendError('**Нечего удалять**');
      return;
    }

    const songId = Number(args[0]);

    if (!isNumber(songId)) {
      message.sendError('**Введите айди трека**', {
        footer: {
          text: 'Подсказка: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue',
        },
      });
      return;
    }

    if (songId <= 0 || songId > queue.songs.length) {
      message.sendError('**Песни под данным айди не найдено**', {
        footer: {
          text: 'Подсказка: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue',
        },
      });
      return;
    }

    const deletedSong = queue.songs.splice(songId - 1, 1)[0];

    message.sendSuccess(`**Песня \`${deletedSong.name}\` - \`${deletedSong.uploader.name}\` удалена**`);
    return;
  }
}

export default new RemoveSongCommand();
