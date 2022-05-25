import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Discord/Embed';
import { formatAniDBAnime } from '../../utils/Media/Anime';

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

    let anime;
    try {
      anime = await client.aniDB.anime(animeID);
    } catch (error) {
      if (error.status === 'Banned') {
        const errorEmbed = ErrorEmbed('**Превышено ограничение на использования API сервиса. Попробуйте позже**');
        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      } else {
        const errorEmbed = ErrorEmbed('**Аниме с данным айди не найдено**');
        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      }
    }

    const embed = formatAniDBAnime(anime);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((message_) => {
      const tagsBlackList = new Set(['Loli']);

      if (anime.tags.some((tag) => tagsBlackList.has(tag))) {
        setTimeout(() => message_.delete(), 30_000);
      }
    });
  },
});
