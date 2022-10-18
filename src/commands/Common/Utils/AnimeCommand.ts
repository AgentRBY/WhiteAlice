import anilist from 'anilist-node';
import { formatAnilistAnime } from '../../../utils/Media/Anime';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class AnimeCommand extends CommonCommand {
  name = 'anime';
  category = 'Utils';
  aliases = [];
  description = 'Поиск аниме по названию';
  examples: CommandExample[] = [
    {
      command: 'anime Naruto',
      description: 'Ищет аниме с названием Naruto',
    },
  ];
  usage = 'anime <имя>';

  async run({ message, args }: CommandRunOptions) {
    const name = args.join(' ');

    if (!name) {
      message.sendError('**Введите имя аниме**');
      return;
    }

    const searchResult = await new anilist().searchEntry.anime(name, null, 1, 1);

    if (!searchResult.media.length) {
      message.sendError('**Аниме не найдено**');
      return;
    }

    const anime = await new anilist().media.anime(searchResult.media[0].id);

    const embed = await formatAnilistAnime(anime);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new AnimeCommand();
