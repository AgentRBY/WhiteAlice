import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { Colors } from '../../static/Colors';
import { upFirstLetter } from '../../utils/strings';
import { NO_IMAGE_URL } from '../../static/Constants';
import { isNumber } from '../../utils/Number';

const nhentai = require('nhentai');

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

    const hHentaiApi = new nhentai.API();

    const manga = await hHentaiApi.fetchDoujin(id);

    if (!manga) {
      const embed = ErrorEmbed('**Манга не найдена**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const authors = manga.tags.artists.length ? manga.tags.artists : manga.tags.groups;

    const embed = new MessageEmbed()
      .setAuthor({
        name: `nHentai | ${manga.id}`,
        url: 'https://nhentai.net/',
        iconURL: 'https://i.imgur.com/evrRyHl.png',
      })
      .setDescription(
        `
        **Имя:** [${manga.titles.pretty}](${manga.url})
        **Загружено:** ${moment(manga.uploadDate).format('MM.DD.YYYY')}
        **Количество страниц:** ${manga.length}
        **Добавили в любимое:** ${manga.favorites}
        **Автор(ы):** ${authors.map((artist) => `[${upFirstLetter(artist.name)}](${artist.url})`).join(', ')}
        **Теги:** \`${[...manga.tags.parodies, ...manga.tags.tags].map((tag) => upFirstLetter(tag.name)).join('`, `')}\`
      `,
      )
      .setColor(Colors.Green);

    const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

    if (!manga.tags.tags.some((tag) => excludedTags.has(tag.name))) {
      embed.setImage(manga.cover.url);
    } else {
      embed.setImage(NO_IMAGE_URL);
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
