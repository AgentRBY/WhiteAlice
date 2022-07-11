import { TraceMoe } from 'trace.moe.ts';
import { Colors } from '../../../static/Colors';
import anilist from 'anilist-node';
import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { isLink, isMediaLink, removeLessAndGreaterSymbols, removeQueryParameters } from '../../../utils/Common/Strings';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class FindanimeCommand extends CommonCommand {
  name = 'findanime';
  category = 'Image Search';
  aliases = ['найтианиме', 'fa'];
  description = `Ищет аниме по ссылке картинку через trace.moe
  Допустимые форматы: png, jpeg, jpg, webp, bmp, gif, mp4
  Для gif-анимаций и видео в поиске будет использоваться первый кадр`;
  usage = 'findanime <ссылка на изображение>';
  examples: CommandExample[] = [
    {
      command: 'findanime https://i.imgur.com/WHc96tx.jpg',
      description: 'Найти аниме по картинке из ссылки',
    },
  ];

  async run({ client, message, args }: CommandRunOptions) {
    let link: string;

    if (message.attachments.size) {
      const attachment = message.attachments.first();
      link = removeQueryParameters(attachment.url || attachment.proxyURL);
    }

    if (args.length) {
      link = removeLessAndGreaterSymbols(removeQueryParameters(args[0]));
    }

    console.log(link);

    if (!link || !isLink(link)) {
      message.sendError('**Введите ссылку на изображение**');
      return;
    }

    if (!isMediaLink(link.toLowerCase())) {
      message.sendError(
        '**Ссылка не ведёт на изображение или видео. Допустимые форматы: `png, jpeg, jpg, webp, bmp, gif, mp4`**',
        {
          footer: { text: 'Для gif-анимаций и видео в поиске будет использоваться первый кадр' },
        },
      );
      return;
    }

    const traceClient = new TraceMoe();

    const response = await traceClient.fetchAnime(link, {
      cutBorders: true,
    });

    if (response.error) {
      message.sendError(`**Произошла ошибка ${response.error}**`, {
        footer: {
          text: 'Попробуйте позже',
        },
      });
      return;
    }
    const anime = response.result.find((anime) => anime.similarity > 0.86);

    if (!anime) {
      message.sendError('**Результаты не найдены**', {
        footer: {
          text: 'Подсказка: попробуйте обрезать изображение, если на нём есть лишний контент или черные полосы',
        },
      });
      return;
    }

    const animeInfo = await new anilist().media.anime(anime.anilist as number);

    const embed = new MessageEmbed()
      .setDescription(
        `**Название:** ${
          animeInfo.title.english || animeInfo.title.romaji || animeInfo.title.userPreferred || 'Не найдено'
        }
           **Эпизод:** ${anime.episode || 'Не найдено'}
           **Точность совпадения:** ${(anime.similarity * 100).toFixed(2)}
           **Имя файла:** ${anime.filename}
           **AniList ID:** [${anime.anilist}](${animeInfo.siteUrl})
           `,
      )
      .setThumbnail(anime.image || anime.video)
      .setColor(Colors.Green)
      .setFooter({
        text: `Что-бы узнать по подробнее об аниме введите команду >anilist ${anime.anilist} или нажмите на кнопку`,
      });

    const showAnimeButton = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('findAnime_showAnime')
        .setLabel('Показать информацию об аниме')
        .setStyle('PRIMARY'),
    );

    const replyMessage = await message.reply({
      embeds: [embed],
      components: [showAnimeButton],
      allowedMentions: { repliedUser: false },
    });

    const collector = replyMessage.createMessageComponentCollector({
      filter: (interaction: ButtonInteraction) => interaction.customId === 'findAnime_showAnime',
      idle: 60_000,
      max: 1,
    });

    collector.on('collect', (interaction: ButtonInteraction) => {
      client.commonCommands.get('anilist').run({ client, message, args: [String(anime.anilist)] });
      interaction.deferUpdate();
    });
  }
}

export default new FindanimeCommand();
