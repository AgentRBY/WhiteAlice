import { ErrorEmbed } from '../../utils/Embed';
import { Command } from '../../structures/Command';
import anilist from 'anilist-node';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Format, Source, Status } from '../../static/Anilist';
import { unix } from 'moment';
import { promisify } from 'util';

const requset = promisify(require('request'));

const getJutsuLink = async (title: string, shorted?: string): Promise<string> => {
  let successLink = null;
  title = title.toLowerCase().replace(/[ /:;]/g, '-');
  const titles = [title];

  if (shorted) {
    shorted = shorted.toLowerCase().replace(/[ /:;]/g, '-');
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

export default new Command({
  name: 'anilist',
  category: 'Utils',
  aliases: ['al', 'анилист'],
  description: 'Ищет информацию об аниме в AniList по id',
  examples: [
    {
      command: 'anilist 1234',
      description: 'Ищет информацию об аниме с айди 1234',
    },
  ],
  usage: 'anilist <id>',
  run: async ({ message, args }) => {
    const animeID = args.length ? Number(args[0]) : null;

    if (!animeID || Number.isNaN(animeID)) {
      const errorEmbed = ErrorEmbed('**Укажите айди аниме**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const animeInfo = await new anilist().media.anime(animeID);

    if (Array.isArray(animeInfo)) {
      const errorEmbed = ErrorEmbed('**Аниме с данным айди не найдено**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    // @ts-ignore
    const nextEpisodeTime = animeInfo?.nextAiringEpisode?.airingAt;

    const episodes = nextEpisodeTime
      ? // @ts-ignore
        `${animeInfo.nextAiringEpisode.episode - 1}/${animeInfo.episodes || '?'}`
      : animeInfo.episodes;
    const title = animeInfo.title.english || animeInfo.title.romaji || animeInfo.title.userPreferred;

    let description = `**Название:** ${title}
         **Количество эпизодов:** ${episodes || 'Неизвестно'}
         **Статус:** ${Status[animeInfo.status]}
         **Тип:** ${Format[animeInfo.format]}
         **Источник:** ${Source[animeInfo.source]}
         **Жанры:** ${animeInfo.genres.join(', ')}`;

    if (animeInfo.averageScore) {
      description += `\n**Средняя оценка:** ${animeInfo.averageScore}%`;
    }

    if (animeInfo.isAdult) {
      description += '\n**Для взрослых:** Да';
    }

    if (nextEpisodeTime) {
      description += `\n**Следующий эпизод:** ${unix(nextEpisodeTime).locale('ru').calendar()}`;
    }

    const jutsuLink = await getJutsuLink(
      animeInfo.title.romaji,
      animeInfo?.synonyms?.length ? animeInfo.synonyms[0] : null,
    );

    if (jutsuLink) {
      description += `\n**Посмотреть аниме:** [клик](${jutsuLink})`;
    }

    const embed = new MessageEmbed()
      .setDescription(description)
      .setImage(animeInfo.coverImage.large)
      .setColor(Colors.Green);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
