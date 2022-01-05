import { Command } from '../../structures/Command';
import { ErrorEmbed } from '../../utils/Embed';
import { client } from '../../app';
import { generateYandexSearchLink, getSitesFromYandexResponse } from '../../utils/ImageSearch';
import { promisify } from 'util';
import { whitelistSites } from '../../static/YandexImageSearch';
import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Site, WhitelistSite } from '../../typings/YandexImagesResponse';

const request = promisify(require('request'));

export default new Command({
  name: 'yandex-image-search',
  category: 'Image Search',
  aliases: ['yis'],
  description: '',
  examples: [],
  usage: 'yandexImageSearch',
  run: async ({ message, args }) => {
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

    const filteredSites: Array<Site & { info: WhitelistSite }> = result.sites
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

    const basicEmbed = new MessageEmbed().setColor(Colors.Green).setAuthor('Найден результат');

    const firstPageEmbed = new MessageEmbed(basicEmbed)
      .setDescription(
        `Найдено на: [${filteredSites[0].info.url}](${filteredSites[0].url})
      Описание сайта: ${filteredSites[0].info.type}
      `,
      )
      .setThumbnail(filteredSites[0].originalImage.url)
      .setFooter(`Страница 1/${filteredSites.length}`);

    let currentPage = 0;

    const paginationButtons = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('yandexImageSearch_Prev')
        .setLabel('Предыдущая страница')
        .setStyle('PRIMARY')
        .setDisabled(currentPage === 0),
      new MessageButton()
        .setCustomId('yandexImageSearch_Next')
        .setLabel('Следующая страница')
        .setStyle('PRIMARY')
        .setDisabled(currentPage === filteredSites.length - 1),
    );

    const replyMessage = await message.reply({
      embeds: [firstPageEmbed],
      components: [paginationButtons],
      allowedMentions: { repliedUser: false },
    });

    const collector = replyMessage.createMessageComponentCollector({
      filter: (interaction: ButtonInteraction) => interaction.customId.startsWith('yandexImageSearch'),
      idle: 120_000,
    });

    collector.on('collect', (interaction: ButtonInteraction) => {
      currentPage = interaction.customId === 'yandexImageSearch_Prev' ? currentPage - 1 : currentPage + 1;

      const pageEmbed = new MessageEmbed(basicEmbed)
        .setDescription(
          `Найдено на: [${filteredSites[currentPage].domain}](${filteredSites[currentPage].url})
         Описание сайта: ${filteredSites[currentPage].info.type}
        `,
        )
        .setThumbnail(filteredSites[currentPage].originalImage.url)
        .setFooter(`Страница ${currentPage + 1}/${filteredSites.length}`);

      paginationButtons.components[0].setDisabled(currentPage === 0);
      paginationButtons.components[1].setDisabled(currentPage === filteredSites.length - 1);

      replyMessage.edit({
        embeds: [pageEmbed],
        components: [paginationButtons],
      });
      interaction.deferUpdate();
    });
  },
});
