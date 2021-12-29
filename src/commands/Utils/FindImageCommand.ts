import sagiri from 'sagiri';
import {ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {Colors} from '../../static/Colors';
import {ErrorEmbed} from '../../utils/Embed';
import {Command} from '../../structures/Command';
import {isGifLink, isImageLink, isLink} from '../../utils/Other';
import {formatNames} from '../../utils/strings';

export default new Command({
  name: 'findImage',
  category: 'Utils',
  aliases: ['find', 'fi', 'image'],
  description: `Поиск изображения в системе SauceNEO. 
  Допустимые форматы: png, jpeg, jpg, webp, bmp, gif.
  Для gif-анимаций в поиске будет использоваться первый кадр`,
  usage: 'findImage [ссылка на картинку]',
  examples: [
    {
      command: 'findImage https://i.imgur.com/KlQUCJG.png',
      description: 'Найти изображение по ссылке',
    },
  ],
  run: async ({ client, message, args }) => {
    let link;

    if (message.attachments.size) {
      const attachment = message.attachments.first();
      link = attachment.url || attachment.proxyURL;
    }

    if (args.length) {
      link = args[0];
    }

    if (!link || !isLink(link)) {
      const errorEmbed = ErrorEmbed('**Введите ссылку**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (!isImageLink(link) && !isGifLink(link)) {
      const errorEmbed = ErrorEmbed(
        '**Ссылка не ведёт на изображение. Допустимые форматы: `png, jpeg, jpg, webp, bmp, gif`**',
      ).setFooter('Для gif-анимаций в поиске будет использоваться первый кадр');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const SauceNEOApi = sagiri(client.config.sauceNAOToken);
    let results = [];

    try {
      results = await SauceNEOApi(link, { db: 999 });
    } catch {
      const errorEmbed = ErrorEmbed('**Произошла ошибка, попробуйте позже**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    results = results.filter((result) => result.similarity > 50);

    if (!results.length) {
      const errorEmbed = ErrorEmbed('**Изображение не найдено**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const relevantSites = new Set(['AniDB', 'nHentai', 'Gelbooru', 'Danbooru', 'Yande.re', 'e621']);
    const relevantSite = results.find((result) => relevantSites.has(result.site));
    const result = relevantSite || results[0];

    const characters =
      result.raw.data.characters || results.find((result) => Boolean(result.raw.data.characters))?.characters;

    const author = result.authorName
      ? `[${result.authorName}](${result.authorUrl})`
      : Array.isArray(result.raw.data.creator)
        ? result.raw.data.creator.join(', ')
        : result.raw.data.creator;

    let description = `**Автор:** ${author || 'Не найдено'}
       **Персонажи:** ${characters ? formatNames(characters) : 'Не найдено'}
       **Точность совпадения:** ${result.similarity}
       **Найдено на:** ${result.site}
       **Ссылка:** [клик](${result.url})`;

    let showAnimeButton;

    const embed = new MessageEmbed().setDescription(description).setThumbnail(result.thumbnail).setColor(Colors.Green);

    if (result.site === 'AniDB' && result.raw.data) {
      const anime = result.raw.data;

      description = '';
      if (anime.source) {
        description += `\n**Аниме**: ${anime.source}`;
      }

      if (anime.part) {
        description += `\n**Эпизод**: ${anime.part}`;
      }

      if (anime.est_time) {
        description += `\n**Из момента:** ${anime.est_time}`;
      }

      description += `\n**Точность совпадения:** ${result.similarity}
       **Найдено на:** ${result.site}
       **Ссылка:** [клик](${result.url})`;

      if (anime.anidb_aid) {
        showAnimeButton = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('findImage_showAnime')
            .setLabel('Показать информацию об аниме')
            .setStyle('PRIMARY'),
        );

        embed.setFooter(
          `Что-бы узнать по подробнее об аниме введите команду >anidb ${anime.anidb_aid} или нажмите на кнопку`,
        );
      }
    }

    embed.setDescription(description);

    const replyMessage = await message.reply({
      embeds: [embed],
      components: showAnimeButton ? [showAnimeButton] : [],
      allowedMentions: { repliedUser: false },
    });

    const collector = replyMessage.createMessageComponentCollector({
      filter: (interaction: ButtonInteraction) => interaction.customId === 'findImage_showAnime',
      idle: 60_000,
      max: 1,
    });

    collector.on('collect', (interaction: ButtonInteraction) => {
      console.log(String(result.raw.data.anidb_aid));
      client.commands.get('anidb').run({client, message, args: [String(result.raw.data.anidb_aid)]});
      interaction.deferUpdate();
    });
  },
});
