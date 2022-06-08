import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { isNumber } from '../../../utils/Common/Number';
import { formatNHentaiManga } from '../../../utils/Media/Manga';
import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';

const nHentai = require('nhentai');

class NHentaiCommand extends Command {
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
    const id = args[0];

    if (!id || !isNumber(id)) {
      const embed = ErrorEmbed('**Укажите айди манги**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const nHentaiApi = new nHentai.API();

    const manga = await nHentaiApi.fetchDoujin(id);

    if (!manga) {
      const embed = ErrorEmbed('**Манга не найдена**');
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

export default new NHentaiCommand();
