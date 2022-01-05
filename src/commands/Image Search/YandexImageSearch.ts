import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Embed';
import { client } from '../../app';
import { generateYandexSearchLink, getSitesFromYandexResponse } from '../../utils/ImageSearch';
import { promisify } from 'util';
import { whitelistSites } from '../../static/YandexImageSearch';
import { MessageActionRow, MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Site, WhitelistSite } from '../../typings/YandexImagesResponse';
import { generateDefaultButtons, pagination } from '../../utils/Pagination';

const request = promisify(require('request'));

export default new Command({
  name: 'yandex-image-search',
  category: 'Image Search',
  aliases: ['yis'],
  description: `Поиск изображений через Яндекс. Бот ищет картинку через Яндекс и фильтрует результаты по URL`,
  examples: [
    {
      command: 'findImage https://i.imgur.com/KlQUCJG.png',
      description: 'Найти изображение по ссылке',
    },
    {
      command: 'findImage -S',
      description: 'Получить список сайтов, по которым фильтруются результаты',
    },
  ],
  usage: 'yandexImageSearch <картинка>',
  run: async ({ message, args, attributes }) => {
    if (attributes.has('S')) {
      const sites = whitelistSites.map((site) => site.url);
      const formattedSites = `\n➤ \`${sites.join('`\n ➤ `')}\``;

      const embed = new MessageEmbed()
        .setDescription(`**Список сайтов, по которым фильтруются результаты:** ${formattedSites}`)
        .setColor(Colors.Green);

      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const imageLink = args[0];

    if (!imageLink) {
      const embed = ErrorEmbed('Введите ссылку на изображение');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const yandexImageLink = generateYandexSearchLink(imageLink, client.config.yandexYU);

    const result = await request(yandexImageLink).then((response) => getSitesFromYandexResponse(response));

    if (!result) {
      const embed = ErrorEmbed('Изображение не найдено');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    type MappedSite = Site & { info: WhitelistSite };

    const filteredSites: MappedSite[] = result.sites
      .map((site) => {
        const formattedURL = site.url.replace(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?/, '');

        const info = whitelistSites.find((whitelistSite) => formattedURL.startsWith(whitelistSite.url));

        if (!info) {
          return;
        }

        return { ...site, info };
      })
      .filter((site) => site);

    if (!filteredSites.length) {
      const embed = ErrorEmbed('Изображение не найдено');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const generateEmbed = (site: MappedSite, page: number, pages: number) => {
      return new MessageEmbed()
        .setColor(Colors.Green)
        .setAuthor('Найден результат')
        .setDescription(
          `Найдено на: [${site.info.url}](${site.url})
           Описание сайта: ${site.info.type}`,
        )
        .setThumbnail(site.originalImage.url)
        .setFooter(`Страница ${page}/${pages}`);
    };

    const pages = filteredSites.map((site, index) => generateEmbed(site, index + 1, filteredSites.length));

    const paginationButtons = new MessageActionRow().addComponents(generateDefaultButtons(pages.length));

    const replyMessage = await message.reply({
      embeds: [generateEmbed(filteredSites[0], 1, filteredSites.length)],
      components: [paginationButtons],
      allowedMentions: { repliedUser: false },
    });

    pagination(replyMessage, pages);
  },
});
