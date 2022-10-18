import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { nHentai } from './HentaiCommand';
import { formatNHentaiManga } from '../../../utils/Media/Manga';
import { getRandomElement } from '../../../utils/Common/Array';
import { SearchSortMode } from 'nhentai-api/types/api';

class RandomHentai extends CommonCommand {
  name = 'randomHentai';
  category = 'Utils';
  aliases = ['rh'];
  description = '';
  examples: CommandExample[] = [];
  usage = 'randomHentai';
  sortMethods: readonly SearchSortMode[] = ['', 'popular', 'popular-week', 'popular-today', 'popular-month'] as const;

  async run({ message, args }: CommandRunOptions) {
    const tags = args.map((tag) => `tag:"${tag.replace('_', '-')}"`);

    if (!tags.length) {
      message.sendError('**Пожалуйста, введите хотя бы один тег**');
      return;
    }

    const sortMethod = getRandomElement(this.sortMethods);
    const searchResult = await nHentai.search(tags.join(' '), 1, sortMethod);

    const manga = getRandomElement(searchResult.books);

    if (!manga) {
      message.sendError('**Хентай с такими тегами не найден**');
      return;
    }

    const embed = formatNHentaiManga(manga);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((message_) => {
      const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

      if (manga.tags.some((tag) => excludedTags.has(tag.name))) {
        setTimeout(() => message_.delete(), 30_000);
      }
    });
  }
}

export default new RandomHentai();
