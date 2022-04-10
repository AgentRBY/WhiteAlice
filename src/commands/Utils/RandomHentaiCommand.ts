import { Command } from '../../structures/Command';
import { formatNHentaiManga } from '../../utils/Manga';
import { Doujin, SearchResult, SortMethods } from 'nhentai';
import { getRandomInt } from '../../utils/Number';
import { ErrorEmbed } from '../../utils/Embed';

const nHentai = require('nhentai');

export default new Command({
  name: 'randomHentai',
  category: 'Utils',
  aliases: [],
  description: `Выводит случайный хентай. Можно искать по тегам, если у тега два слова, то нужно писать его через нижние подчёркивание (_)`,
  examples: [
    {
      command: 'randomHentai',
      description: 'Выводит случайный хентай',
    },
    {
      command: 'randomHentai uncensored solo_male',
      description: 'Выводит хентай по тегам Uncensored и Solo Male',
    },
  ],
  usage: 'randomHentai',
  run: async ({ message, args }) => {
    const tags = args.map((tag) => `tag:"${tag.replace('_', '-')}"`);

    const nHentaiApi = new nHentai.API();

    let searchResult: SearchResult;

    if (tags.length) {
      const sortMethod = Object.values(SortMethods)[getRandomInt(0, Object.values(SortMethods).length - 1)];
      searchResult = await nHentaiApi.search(tags.join(' '), 1, sortMethod);
    }

    const manga: Doujin = searchResult
      ? searchResult.doujins[getRandomInt(0, searchResult.doujins.length - 1)]
      : await nHentaiApi.randomDoujin();

    if (!manga) {
      const embed = ErrorEmbed('**Хентай с такими тегами не найден**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = formatNHentaiManga(manga);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((msg) => {
      const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

      if (manga.tags.tags.some((tag) => excludedTags.has(tag.name))) {
        setTimeout(() => msg.delete(), 30_000);
      }
    });
  },
});
