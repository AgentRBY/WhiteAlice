import { ErrorEmbed } from '../../../utils/Discord/Embed';

import anilist from 'anilist-node';
import { formatAnilistAnime } from '../../../utils/Media/Anime';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class AnilistCommand extends CommonCommand {
  name = 'anilist';
  category = 'Utils';
  aliases = ['al', 'анилист'];
  description = 'Ищет информацию об аниме в AniList по id';
  examples: CommandExample[] = [
    {
      command: 'anilist 1234',
      description: 'Ищет информацию об аниме с айди 1234',
    },
  ];
  usage = 'anilist <id>';

  async run({ message, args }: CommandRunOptions) {
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

    const embed = await formatAnilistAnime(animeInfo);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new AnilistCommand();