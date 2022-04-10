import { Command } from '../../structures/Command';
import { formatNHentaiManga } from '../../utils/Manga';

const nHentai = require('nhentai');

export default new Command({
  name: 'randomHentai',
  category: 'Utils',
  aliases: [],
  description: 'Выводит случайный хентай',
  examples: [
    {
      command: 'randomHentai',
      description: 'Выводит случайный хентай',
    },
  ],
  usage: 'randomHentai',
  run: async ({ message }) => {
    const nHentaiApi = new nHentai.API();

    const manga = await nHentaiApi.randomDoujin();

    const embed = formatNHentaiManga(manga);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
