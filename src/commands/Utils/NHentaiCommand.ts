import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Embed';
import { isNumber } from '../../utils/Number';
import { formatNHentaiManga } from '../../utils/Manga';

const nHentai = require('nhentai');

export default new Command({
  name: 'nHentai',
  category: 'Utils',
  aliases: ['nh'],
  description: 'Выводит информацию о хентае из nHentai по его айди',
  examples: [
    {
      command: 'nHentai 1234',
      description: 'Выводит информацию о хентае с айди 1234',
    },
  ],
  usage: 'nHentai <айди>',
  run: async ({ message, args }) => {
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

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
