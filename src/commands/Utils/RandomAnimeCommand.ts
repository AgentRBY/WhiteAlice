import { Command } from '../../structures/Command';
import anilist from 'anilist-node';
import { formatAnilistAnime } from '../../utils/Anime';
import { upAllFirstLatter } from '../../utils/strings';
import { ErrorEmbed } from '../../utils/Embed';
import { getRandomInt } from '../../utils/Number';
import { SortList } from '../../static/Anilist';

export default new Command({
  name: 'randomAnime',
  category: 'Utils',
  aliases: [],
  description:
    'Ищет случайное аниме по тегам. Теги перечисляются через пробел, если в теге два слова, то писать через нижнее подчёркивание (_)',
  examples: [
    {
      command: 'randomAnime Food',
      description: 'Выводит случайное аниме с тегом Food',
    },
    {
      command: 'randomAnime Food Love_Triangle',
      description: 'Выводит случайное аниме с тегами Food и Love Triangle',
    },
  ],
  usage: 'randomAnime',
  run: async ({ message, args }) => {
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
  },
});
