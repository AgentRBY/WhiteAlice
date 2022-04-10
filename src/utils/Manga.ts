import { Doujin } from 'nhentai';
import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { upFirstLetter } from './strings';
import { Colors } from '../static/Colors';

export function formatNHentaiManga(manga: Doujin): MessageEmbed {
  const authors = manga.tags.artists.length ? manga.tags.artists : manga.tags.groups;
  const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

  return new MessageEmbed()
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
        **Теги:** ${[...manga.tags.parodies, ...manga.tags.tags]
          .map((tag) => upFirstLetter(tag.name))
          .map((tag) => (excludedTags.has(tag.toLowerCase()) ? `__\`${tag}\`__` : `\`${tag}\``))
          .join(', ')}
      `,
    )
    .setColor(Colors.Green)
    .setImage(manga.cover.url);
}
