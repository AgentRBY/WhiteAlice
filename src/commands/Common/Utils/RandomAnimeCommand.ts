import anilist from 'anilist-node';
import { formatAnilistAnime } from '../../../utils/Media/Anime';
import { upAllFirstLatter } from '../../../utils/Common/Strings';
import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { getRandomInt } from '../../../utils/Common/Number';
import { SortList } from '../../../static/Anilist';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class RandomAnimeCommand extends CommonCommand {
  name = 'randomAnime';
  category = 'Utils';
  aliases = [];
  description =
    'Ищет случайное аниме по тегам. Теги перечисляются через пробел, если в теге два слова, то писать через нижнее подчёркивание (_)';
  examples: CommandExample[] = [
    {
      command: 'randomAnime Food',
      description: 'Выводит случайное аниме с тегом Food',
    },
    {
      command: 'randomAnime Food Love_Triangle',
      description: 'Выводит случайное аниме с тегами Food и Love Triangle',
    },
  ];
  usage = 'randomAnime';

  async run({ message, args }: CommandRunOptions) {
    const tags = args.map((argument) => `"${upAllFirstLatter(argument.replace('_', ' '))}"`);

    if (!tags.length) {
      const embed = ErrorEmbed('**Введите один или несколько тегов**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }
    const totalResults = await new anilist().searchEntry.anime(
      null,
      {
        tag_in: tags,
      },
      2,
      25,
    );

    const searchResult = await new anilist().searchEntry.anime(
      null,
      {
        tag_in: tags,
        sort: [SortList[getRandomInt(0, SortList.length - 1)]],
      },
      totalResults.pageInfo.hasNextPage ? getRandomInt(1, 2) : 1,
      25,
    );

    if (!searchResult.media.length) {
      const embed = ErrorEmbed('**Результаты не найдены**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const anime = await new anilist().media.anime(
      searchResult.media[getRandomInt(0, searchResult.media.length - 1)].id,
    );

    const embed = await formatAnilistAnime(anime);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new RandomAnimeCommand();
