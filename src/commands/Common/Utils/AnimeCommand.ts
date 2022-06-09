import { ErrorEmbed } from '../../../utils/Discord/Embed';
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
      const embed = ErrorEmbed('**Введите имя аниме**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const searchResult = await new anilist().searchEntry.anime(name, null, 1, 1);

    const anime = await new anilist().media.anime(searchResult.media[0].id);

    const embed = await formatAnilistAnime(anime);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new AnimeCommand();
