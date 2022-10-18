import { formatNHentaiManga } from '../../../utils/Media/Manga';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { API } from 'nhentai-api';

export const nHentai = new API();

class HentaiCommand extends CommonCommand {
  name = 'hentai';
  category = 'Utils';
  aliases = [];
  description = 'Поиск хентая на nHentai по запросу';
  examples: CommandExample[] = [
    {
      command: 'hentai Sword Art Online',
      description: 'Выдаст хентай по тематике Sword Art Online',
    },
  ];
  usage = 'hentai <запрос>';

  async run({ message, args }: CommandRunOptions) {
    const name = args.join(' ');

    if (!name) {
      message.sendError('**Пожалуйста, введите имя хентая**');
      return;
    }

    const searchResult = await nHentai.search(name);
    const manga = searchResult.books[0];

    const embed = formatNHentaiManga(manga);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((message_) => {
      const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

      if (manga.tags.some((tag) => excludedTags.has(tag.name))) {
        setTimeout(() => message_.delete(), 30_000);
      }
    });
  }
}

export default new HentaiCommand();
