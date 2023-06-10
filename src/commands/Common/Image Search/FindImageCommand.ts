import { Message, MessageActionRow, MessageEmbed } from 'discord.js';
import sagiri, { SagiriResult } from 'sagiri-fork';
import { Colors } from '../../../static/Colors';
import { sauceNAORelevantSites } from '../../../static/ImageSearch';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

import {
  formatNames,
  getTenorLink,
  isGifLink,
  isImageLink,
  isLink,
  LINK_REGEX,
  removeLessAndGreaterSymbols,
  removeQueryParameters,
} from '../../../utils/Common/Strings';
import { generateDefaultButtons, pagination } from '../../../utils/Discord/Pagination';
import Logger from '../../../utils/Logger';

export class FindImageCommand extends CommonCommand {
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

  async run({ client, message }: CommandRunOptions) {
    if (!client.config.sauceNAOToken) {
      message.sendError('**Ключ API для SauceNAO не найден в переменных среды бота. Команда отключена.**');
      return;
    }

    const link = await FindImageCommand.getImageLink(message);

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
    let results: SagiriResult[] = [];

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
    const generateEmbed = (site: SagiriResult, sites: SagiriResult[], page: number, pages: number) => {
      const characters =
        site.raw.data.characters || sites.find((site) => Boolean(site.raw.data.characters))?.raw.data.characters;

      const author = site.authorName
        ? `[${site.authorName}](${site.authorUrl})`
        : Array.isArray(site.raw.data.creator)
        ? site.raw.data.creator.join(', ')
        : site.raw.data.creator;

      let description = `**Автор:** ${author || 'Не найдено'}
       **Персонажи:** ${characters ? formatNames(characters) : 'Не найдено'}
       **Точность совпадения:** ${site.similarity}
       **Найдено на:** ${site.site} ${site.site === 'Kemono' ? `(${site.raw.data.service_name})` : ''}
       **Ссылка на оригинал:** [клик](${site.url})
       ${
         site.site === 'Kemono'
           ? `**Ссылка на Kemono**: [клик](https://kemono.party/${site.raw.data.service}/user/${site.raw.data.user_id}/post/${site.raw.data.id})`
           : ''
       }`;

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

  public static async getImageLink(message: Message, checkReference = true): Promise<string | undefined> {
    let link;

    if (message.attachments.size) {
      const attachment = message.attachments.first();
      link = removeQueryParameters(attachment.url || attachment.proxyURL);
    }

    if (!link && message.content) {
      link = LINK_REGEX.exec(message.content)?.[0];
    }

    if (link) {
      link = removeLessAndGreaterSymbols(removeQueryParameters(link));
    }

    if (message.embeds.length) {
      const tenorGifLink = getTenorLink(message.embeds);

      if (tenorGifLink) {
        link = tenorGifLink;
      }
    }

    if (!link && checkReference && message.reference) {
      const reference = await message.fetchReference();

      return this.getImageLink(reference, false);
    }

    return link;
  }
}

export default new FindImageCommand();
