import { formatAniDBAnime } from '../../../utils/Media/Anime';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class AnidbCommand extends CommonCommand {
  name = 'anidb';
  category = 'Utils';
  aliases = ['adb', 'анидб'];
  description = 'Ищет информацию об аниме в AniDB по id';
  examples: CommandExample[] = [
    {
      command: 'anidb 1234',
      description: 'Ищет информацию об аниме с айди 1234',
    },
  ];
  usage = 'anidb <id>';

  async run({ client, message, args }: CommandRunOptions) {
    const animeID = args.length ? Number(args[0]) : null;

    if (!animeID || Number.isNaN(animeID)) {
      message.sendError('**Укажите айди аниме**');
    }

    let anime;
    try {
      anime = await client.aniDB.anime(animeID);
    } catch (error) {
      if (error.status === 'Banned') {
        message.sendError('**Превышено ограничение на использования API сервиса. Попробуйте позже**');
      } else {
        message.sendError('**Аниме с данным айди не найдено**');
      }
    }

    const embed = formatAniDBAnime(anime);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).then((message_) => {
      const tagsBlackList = new Set(['Loli']);

      if (anime.tags.some((tag) => tagsBlackList.has(tag))) {
        setTimeout(() => message_.delete(), 30_000);
      }
    });
  }
}

export default new AnidbCommand();
