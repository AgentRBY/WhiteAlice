import { formatNHentaiManga } from '../../utils/Media/Manga';
import { Doujin, SearchResult, SortMethods } from 'nhentai';
import { getRandomInt } from '../../utils/Common/Number';
import { ErrorEmbed } from '../../utils/Discord/Embed';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

const nHentai = require('nhentai');

class RandomHentaiCommand extends Command {
  name = 'randomHentai';
  category = 'Utils';
  aliases = [];
  description =
    'Выводит случайный хентай. Можно искать по тегам, если у тега два слова, то нужно писать его через нижние подчёркивание (_)';
  examples: CommandExample[] = [
    {
      command: 'randomHentai',
      description: 'Выводит случайный хентай',
    },
    {
      command: 'randomHentai uncensored solo_male',
      description: 'Выводит хентай по тегам Uncensored и Solo Male',
    },
  ];
  usage = 'randomHentai';

  async run({ message, args }: CommandRunOptions) {
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

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((message_) => {
      const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

      if (manga.tags.tags.some((tag) => excludedTags.has(tag.name))) {
        setTimeout(() => message_.delete(), 30_000);
      }
    });
  }
}

export default new RandomHentaiCommand();
