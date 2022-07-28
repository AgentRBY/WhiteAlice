import sagiri from 'sagiri-fork';
import { MessageActionRow, MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';

import {
  formatNames,
  isGifLink,
  isImageLink,
  isLink,
  removeLessAndGreaterSymbols,
  removeQueryParameters,
} from '../../../utils/Common/Strings';
import { generateDefaultButtons, pagination } from '../../../utils/Discord/Pagination';
import { sauceNAORelevantSites } from '../../../static/ImageSearch';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import Logger from '../../../utils/Logger';

class FindImageCommand extends CommonCommand {
  name = 'findImage';
  category = 'Image Search';
  aliases = ['find', 'fi', 'image'];
  description = `Поиск изображения в системе SauceNAO. 
  Допустимые форматы: png, jpeg, jpg, webp, bmp, gif.
  Для gif-анимаций в поиске будет использоваться первый кадр`;
  usage = 'findImage [ссылка на картинку]';
  examples: CommandExample[] = [
    {
      command: 'findImage https://i.imgur.com/KlQUCJG.png',
      description: 'Найти изображение по ссылке',
    },
  ];

  async run({ client, message, args }: CommandRunOptions) {
    let link;

    if (message.attachments.size) {
      const attachment = message.attachments.first();
      link = removeQueryParameters(attachment.url || attachment.proxyURL);
    }

    if (args.length) {
      link = removeLessAndGreaterSymbols(removeQueryParameters(args[0]));
    }

    if (!link || !isLink(link)) {
      message.sendError('**Введите ссылку на изображение**');
      return;
    }

    if (!isImageLink(link.toLowerCase()) && !isGifLink(link.toLowerCase())) {
      message.sendError(
        '**Ссылка не ведёт на изображение или видео. Допустимые форматы: `png, jpeg, jpg, webp, bmp, gif`**',
        {
          footer: { text: 'Для gif-анимаций и видео в поиске будет использоваться первый кадр' },
        },
      );
      return;
    }

    const SauceNAOApi = sagiri(client.config.sauceNAOToken);
    let results = [];

    try {
      results = await SauceNAOApi(link, { db: 999 });
    } catch (error) {
      Logger.error(error);
      message.sendError('**Произошла ошибка, попробуйте ещё раз**');
      return;
    }

    results = results.filter((result) => result.similarity > 50);

    if (!results.length) {
      message.sendError('**Результаты не найдены**', {
        footer: {
          text: 'Подсказка: попробуйте обрезать изображение, если на нём есть лишний контент или черные полосы',
        },
      });
      return;
    }

    let filteredSites = results.filter((result) => sauceNAORelevantSites.has(result.site));

    if (!filteredSites.length) {
      filteredSites = [results[0]];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateEmbed = (site: any, sites: any[], page: number, pages: number) => {
      const characters =
        site.raw.data.characters || sites.find((site) => Boolean(site.raw.data.characters))?.characters;

      const author = site.authorName
        ? `[${site.authorName}](${site.authorUrl})`
        : Array.isArray(site.raw.data.creator)
        ? site.raw.data.creator.join(', ')
        : site.raw.data.creator;

      let description = `**Автор:** ${author || 'Не найдено'}
       **Персонажи:** ${characters ? formatNames(characters) : 'Не найдено'}
       **Точность совпадения:** ${site.similarity}
       **Найдено на:** ${site.site}
       **Ссылка:** [клик](${site.url})`;

      const embed = new MessageEmbed().setDescription(description).setThumbnail(site.thumbnail).setColor(Colors.Green);

      if (site.site === 'AniDB' && site.raw.data) {
        const anime = site.raw.data;

        description = `**Аниме**: ${anime.source}
           **Эпизод**: ${anime.part}
           **Из момента:** ${anime.est_time}
           **Точность совпадения:** ${site.similarity}
           **Найдено на:** ${site.site}
           **Ссылка:** [клик](${site.url})`;

        if (anime.anidb_aid) {
          embed.setFooter({
            text: `Что-бы узнать по подробнее об аниме введите команду >anidb ${anime.anidb_aid} или нажмите на кнопку`,
          });
        }
      }

      embed.setDescription(description);
      embed.setFooter({ text: `${embed.footer?.text || ''}\nСтраница ${page}/${pages}` });

      return embed;
    };

    const pages = filteredSites.map((site, index) =>
      generateEmbed(site, filteredSites, index + 1, filteredSites.length),
    );

    const paginationButtons = new MessageActionRow().addComponents(generateDefaultButtons(pages.length));

    const replyMessage = await message.reply({
      embeds: [generateEmbed(filteredSites[0], filteredSites, 1, filteredSites.length)],
      components: [paginationButtons],
      allowedMentions: { repliedUser: false },
    });

    pagination(replyMessage, pages);
  }
}

export default new FindImageCommand();
