import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import moment from 'moment/moment';
import { upFirstLetter } from '../../utils/strings';
import { NO_IMAGE_URL } from '../../static/Constants';

export default new Command({
  name: 'anidb',
  category: 'Utils',
  aliases: ['adb', 'анидб'],
  description: 'Ищет информацию об аниме в AniDB по id',
  examples: [
    {
      command: 'anidb 1234',
      description: 'Ищет информацию об аниме с айди 1234',
    },
  ],
  usage: 'anidb <id>',
  run: async ({ client, message, args }) => {
    const animeID = args.length ? Number(args[0]) : null;

    if (!animeID || Number.isNaN(animeID)) {
      const errorEmbed = ErrorEmbed('**Укажите айди аниме**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    let animeInfo;
    try {
      animeInfo = await client.aniDB.anime(animeID);
    } catch (error) {
      if (error.status === 'Banned') {
        const errorEmbed = ErrorEmbed('**Превышено ограничение на использования API сервиса. Попробуйте позже**');
        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      } else {
        const errorEmbed = ErrorEmbed('**Аниме с данным айди не найдено**');
        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      }
    }

    const lastEpisodeId = animeInfo.episodes.reduce(
      (accumulator, current, index) => (moment(current.airDate).isAfter() ? accumulator : index),
      0,
    );

    const lastEpisode = animeInfo.episodes[lastEpisodeId];
    const episodes = animeInfo.endDate
      ? animeInfo.episodeCount
      : `${Number(lastEpisode.episodeNumber) < animeInfo.episodeCount ? lastEpisode.episodeNumber : '?'}/${
          animeInfo.episodeCount || '?'
        }`;

    const title =
      animeInfo.titles.find((title) => title.language === 'ru')?.title ||
      animeInfo.titles.find((title) => title.language === 'x-jat')?.title;

    const excludedTags = new Set(['angst', 'Japan', 'Earth', 'Asia']);

    const tags = animeInfo.tags.reduce((accumulator, current) => {
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

    let description = `**Название:** ${title}
         **Количество эпизодов:** ${episodes || 'Неизвестно'}
         **Тип:** ${animeInfo.type || 'Неизвестно'}
         **Теги:** ${tags.join(', ')}`;

    if (animeInfo.ratings?.temporary) {
      description += `\n**Средняя оценка:** ${animeInfo.ratings.temporary.score}/10`;
    }

    if (animeInfo.ageRestricted) {
      description += '\n**Для взрослых:** Да';
    }

    const nextEpisode = animeInfo.episodes[lastEpisodeId + 1];

    if (nextEpisode) {
      description += `\n**Следующий эпизод:** ${moment(nextEpisode.airDate).locale('ru').calendar()}`;
    }

    const embed = new MessageEmbed()
      .setDescription(description)

      .setColor(Colors.Green);
    const tagsBlackList = new Set(['Loli']);

    const isTagsContainBlockedTags = tags.some((tag) => tagsBlackList.has(tag));
    if (!isTagsContainBlockedTags) {
      embed.setImage(`https://cdn-eu.anidb.net/images/main/${animeInfo.picture}`);
    } else {
      embed.setImage(NO_IMAGE_URL);
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
