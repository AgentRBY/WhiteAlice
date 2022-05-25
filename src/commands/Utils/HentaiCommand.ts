import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Discord/Embed';
import { formatNHentaiManga } from '../../utils/Media/Manga';

const nHentai = require('nhentai');

export default new Command({
  name: 'hentai',
  category: 'Utils',
  aliases: [],
  description: 'Поиск хентая на nHentai по запросу',
  examples: [
    {
      command: 'hentai Sword Art Online',
      description: 'Выдаст хентай по тематике Sword Art Online',
    },
  ],
  usage: 'hentai <запрос>',
  run: async ({ message, args }) => {
    const name = args.join(' ');

    if (!name) {
      const embed = ErrorEmbed('**Пожалуйста, введите имя хентая**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const nHentaiApi = new nHentai.API();

    const searchResult = await nHentaiApi.search(name);
    const manga = searchResult.doujins[0];

    const embed = formatNHentaiManga(manga);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((message_) => {
      const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

      if (manga.tags.tags.some((tag) => excludedTags.has(tag.name))) {
        setTimeout(() => message_.delete(), 30_000);
      }
    });
  },
});
