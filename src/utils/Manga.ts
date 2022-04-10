import { Doujin } from 'nhentai';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { upFirstLetter } from './strings';
import { Colors } from '../static/Colors';
import { NO_IMAGE_URL } from '../static/Constants';

export function formatNHentaiManga(manga: Doujin): MessageEmbed {
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

  return embed;
}
