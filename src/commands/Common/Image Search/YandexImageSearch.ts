import { MessageActionRow, MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { Colors } from '../../../static/Colors';
import { yandexWhitelistSites } from '../../../static/ImageSearch';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { Site, WhitelistSite } from '../../../typings/YandexImagesResponse';
import { generateDefaultButtons, pagination } from '../../../utils/Discord/Pagination';
import { generateYandexSearchLink, getSitesFromYandexResponse } from '../../../utils/Media/ImageSearch';
import { FindImageCommand } from './FindImageCommand';

const request = promisify(require('request'));

class YandexImageSearchCommand extends CommonCommand {
  name = 'yandex-image-search';
  category = 'Image Search';
  aliases = ['yis'];
  description = 'Поиск изображений через Яндекс. Бот ищет картинку через Яндекс и фильтрует результаты по URL';
  examples: CommandExample[] = [
    {
      command: 'findImage https://i.imgur.com/KlQUCJG.png',
      description: 'Найти изображение по ссылке',
    },
    {
      command: 'findImage -S',
      description: 'Получить список сайтов, по которым фильтруются результаты',
    },
  ];
  usage = 'yandexImageSearch <картинка>';

  async run({ client, message, attributes }: CommandRunOptions) {
    if (attributes.has('S')) {
      const sites = yandexWhitelistSites.map((site) => site.url);
      const formattedSites = `\n➤ \`${sites.join('`\n ➤ `')}\``;

      const embed = new MessageEmbed()
        .setDescription(`**Список сайтов, по которым фильтруются результаты:** ${formattedSites}`)
        .setColor(Colors.Green);

      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const link = await FindImageCommand.getImageLink(message);

    const yandexImageLink = generateYandexSearchLink(link, client.config.yandexYU);

    const result = await request(yandexImageLink).then((response) => getSitesFromYandexResponse(response));

    if (!result) {
      message.sendError('**Результаты не найдены**', {
        footer: {
          text: 'Подсказка: попробуйте обрезать изображение, если на нём есть лишний контент или черные полосы',
        },
      });
      return;
    }

    type MappedSite = Site & { info: WhitelistSite };

    const filteredSites: MappedSite[] = result.sites
      .map((site) => {
        const formattedURL = site.url.replace(/^(?:https?:\/\/)?(?:[^\n/@]+@)?(?:www\.)?/, '');

        const info = yandexWhitelistSites.find((whitelistSite) => formattedURL.startsWith(whitelistSite.url));

        if (!info) {
          return;
        }

        return { ...site, info };
      })
      .filter(Boolean)
      .sort((firstSite, secondarySite) => secondarySite.info.priority - firstSite.info.priority);

    if (!filteredSites.length) {
      message.sendError('**Результаты не найдены**');
      return;
    }

    const generateEmbed = (site: MappedSite, page: number, pages: number) => {
      return new MessageEmbed()
        .setColor(Colors.Green)
        .setAuthor({ name: 'Найден результат' })
        .setDescription(
          `Найдено на: [${site.info.url}](${site.url})
           Описание сайта: ${site.info.type}`,
        )
        .setThumbnail(site.originalImage.url)
        .setFooter({ text: `Страница ${page}/${pages}` });
    };

    const pages = filteredSites.map((site, index) => generateEmbed(site, index + 1, filteredSites.length));

    const paginationButtons = new MessageActionRow().addComponents(generateDefaultButtons(pages.length));

    const replyMessage = await message.reply({
      embeds: [generateEmbed(filteredSites[0], 1, filteredSites.length)],
      components: [paginationButtons],
      allowedMentions: { repliedUser: false },
    });

    pagination(replyMessage, pages);
  }
}

export default new YandexImageSearchCommand();
