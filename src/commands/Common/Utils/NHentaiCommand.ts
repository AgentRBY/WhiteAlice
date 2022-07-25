import { isNumber } from '../../../utils/Common/Number';
import { formatNHentaiManga } from '../../../utils/Media/Manga';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { nHentai } from './HentaiCommand';

class NHentaiCommand extends CommonCommand {
  name = 'nHentai';
  category = 'Utils';
  aliases = ['nh'];
  description = 'Выводит информацию о хентае из nHentai по его айди';
  examples: CommandExample[] = [
    {
      command: 'nHentai 1234',
      description: 'Выводит информацию о хентае с айди 1234',
    },
  ];
  usage = 'nHentai <айди>';

  async run({ message, args }: CommandRunOptions) {
    const id = Number(args[0]);

    if (!isNumber(id)) {
      message.sendError('**Укажите айди манги**');
      return;
    }

    const manga = await nHentai.getBook(id);

    if (!manga) {
      message.sendError('**Манга не найдена**');
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

export default new NHentaiCommand();
