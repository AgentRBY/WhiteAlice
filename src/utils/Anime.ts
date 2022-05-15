import { AnimeEntry } from 'anilist-node';
import { Format, Source, Status } from '../static/Anilist';
import { unix } from 'moment';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../static/Colors';
import { promisify } from 'util';
import moment from 'moment/moment';
import { upFirstLetter } from './strings';

const requset = promisify(require('request'));

const getJutsuLink = async (title: string, shorted?: string): Promise<string> => {
  let successLink = null;
  title = title.toLowerCase().replace(/[ /:;☆]/g, '-');
  const titles = [title];

  if (shorted) {
    shorted = shorted.toLowerCase().replace(/[ /:;☆]/g, '-');
    titles.push(encodeURI(shorted));
  }

  for (const testTitle of titles) {
    await requset(`https://jut.su/${testTitle}/`).then((response) => {
      if (response.statusCode === 200) {
        successLink = `https://jut.su/${testTitle}/`;
      }
    });

    if (!successLink) {
      await requset(`https://jut.su/${testTitle.split('-').slice(0, 2).join('-')}/`).then((response) => {
        if (response.statusCode === 200) {
          successLink = `https://jut.su/${testTitle.split('-').slice(0, 2).join('-')}/`;
        }
      });
    }

    if (!successLink) {
      await requset(`https://jut.su/${testTitle.split('-').slice(0, 3).join('-')}/`).then((response) => {
        if (response.statusCode === 200) {
          successLink = `https://jut.su/${testTitle.split('-').slice(0, 3).join('-')}/`;
        }
      });
    }

    if (!successLink) {
      await requset(`https://jut.su/${testTitle.split('-').slice(2).join('-')}/`).then((response) => {
        if (response.statusCode === 200) {
          successLink = `https://jut.su/${testTitle.split('-').slice(2).join('-')}/`;
        }
      });
    }

    if (successLink) {
      break;
    }
  }

  return successLink !== 'https://jut.su//' ? successLink : null;
};

export async function formatAnilistAnime(anime: AnimeEntry): Promise<MessageEmbed> {
  // @ts-ignore
  const nextEpisodeTime = anime?.nextAiringEpisode?.airingAt;

  const episodes = nextEpisodeTime
    ? // @ts-ignore
      `${anime.nextAiringEpisode.episode - 1}/${anime.episodes || '?'}`
    : anime.episodes;
  const title = anime.title.english || anime.title.romaji || anime.title.userPreferred;

  let description = `**Название:** ${title}
         **Количество эпизодов:** ${episodes || 'Неизвестно'}
         **Статус:** ${Status[anime.status]}
         **Тип:** ${Format[anime.format]}
         **Источник:** ${Source[anime.source]}
         **Жанры:** ${anime.genres.join(', ')}
         **Тэги:** ${anime.tags
           .filter((tag) => !tag.isMediaSpoiler)
           .map((tag) => tag.name)
           .join(', ')}`;

  if (anime.averageScore) {
    description += `\n**Средняя оценка:** ${anime.averageScore}%`;
  }

  if (anime.isAdult) {
    description += '\n**Для взрослых:** Да';
  }

  if (nextEpisodeTime) {
    description += `\n**Следующий эпизод:** ${unix(nextEpisodeTime).locale('ru').calendar()}`;
  }

  const jutsuLink = await getJutsuLink(anime.title.romaji, anime?.synonyms?.length ? anime.synonyms[0] : null);

  if (jutsuLink) {
    description += `\n**Посмотреть аниме:** [клик](${jutsuLink})`;
  }

  return new MessageEmbed().setDescription(description).setImage(anime.coverImage.large).setColor(Colors.Green);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatAniDBAnime(anime: any): MessageEmbed {
  const lastEpisodeId = anime.episodes.reduce(
    (accumulator, current, index) => (moment(current.airDate).isAfter() ? accumulator : index),
    0,
  );

  const lastEpisode = anime.episodes[lastEpisodeId];
  const episodes = anime.endDate
    ? anime.episodeCount
    : `${Number(lastEpisode.episodeNumber) < anime.episodeCount ? lastEpisode.episodeNumber : '?'}/${
        anime.episodeCount || '?'
      }`;

  const title =
    anime.titles.find((title) => title.language === 'ru')?.title ||
    anime.titles.find((title) => title.language === 'x-jat')?.title;

  const excludedTags = new Set(['angst', 'Japan', 'Earth', 'Asia']);

  const tags = anime.tags.reduce((accumulator, current) => {
    if (current.localSpoiler) {
      return accumulator;
    }

    if (current.weight === 0) {
      return accumulator;
    }

    if (excludedTags.has(current.name)) {
      return accumulator;
    }

    return [...accumulator, upFirstLetter(current.name)];
  }, '');
  const tagsBlackList = new Set(['Loli']);

  let description = `**Название:** ${title}
         **Количество эпизодов:** ${episodes || 'Неизвестно'}
         **Тип:** ${anime.type || 'Неизвестно'}
         **Теги:** ${tags.map((tag) => (tagsBlackList.has(tag) ? `__\`${tag}\`__` : `\`${tag}\``)).join(', ')}`;

  if (anime.ratings?.temporary) {
    description += `\n**Средняя оценка:** ${anime.ratings.temporary.score}/10`;
  }

  if (anime.ageRestricted) {
    description += '\n**Для взрослых:** Да';
  }

  const nextEpisode = anime.episodes[lastEpisodeId + 1];

  if (nextEpisode) {
    description += `\n**Следующий эпизод:** ${moment(nextEpisode.airDate).locale('ru').calendar()}`;
  }

  return new MessageEmbed()
    .setDescription(description)
    .setColor(Colors.Green)
    .setImage(`https://cdn-eu.anidb.net/images/main/${anime.picture}`);
}
