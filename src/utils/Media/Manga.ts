import { MessageEmbed } from 'discord.js';
import moment from 'moment';
import { upFirstLetter } from '../Common/Strings';
import { Colors } from '../../static/Colors';
import { Book } from 'nhentai-api';
import { nHentai } from '../../commands/Common/Utils/HentaiCommand';

export function formatNHentaiManga(manga: Book): MessageEmbed {
  const authors = manga.artists.length ? manga.artists : manga.groups;
  const excludedTags = new Set(['lolicon', 'shotacon', 'guro', 'coprophagia', 'scat']);

  return new MessageEmbed()
    .setAuthor({
      name: `nHentai | ${manga.id}`,
      url: 'https://nhentai.net/',
      iconURL: 'https://i.imgur.com/evrRyHl.png',
    })
    .setDescription(
      `
        **Имя:** [${manga.title.pretty}](https://nhentai.to/g/${manga.id})
        **Загружено:** ${moment(manga.uploaded).format('MM.DD.YYYY')}
        **Количество страниц:** ${manga.pages.length}
        **Добавили в любимое:** ${manga.favorites}
        **Автор(ы):** ${authors.map((artist) => `[${upFirstLetter(artist.name)}](${artist.url})`).join(', ')}
        **Теги:** ${[...manga.parodies, ...manga.tags]
          .map((tag) => upFirstLetter(tag.name))
          .map((tag) => (excludedTags.has(tag.toLowerCase()) ? `__\`${tag}\`__` : `\`${tag}\``))
          .join(', ')}
      `,
    )
    .setColor(Colors.Green)
    .setImage(nHentai.getImageURL(manga.cover));
}
