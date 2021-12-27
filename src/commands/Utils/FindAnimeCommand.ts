import {Command} from '../../structures/Command';
import {ErrorEmbed} from '../../utils/Embed';
import {TraceMoe} from 'trace.moe.ts';
import {Colors} from '../../static/Colors';
import anilist from 'anilist-node';
import {ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {isLink, isMediaLink} from '../../utils/Other';

export default new Command({
  name: 'findanime',
  category: 'Utils',
  aliases: ['найтианиме', 'fa'],
  description: `Ищет аниме по ссылке картинку через trace.moe
  Допустимые форматы: png, jpeg, jpg, webp, bmp, gif, mp4
  Для gif-анимаций и видео в поиске будет использоваться первый кадр`,
  usage: 'findanime <ссылка на изображение>',
  examples: [
    {
      command: 'findanime https://i.imgur.com/WHc96tx.jpg',
      description: 'Найти аниме по картинке из ссылки',
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
      const errorEmbed = ErrorEmbed('**Укажите ссылку**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (!isMediaLink(link)) {
      const errorEmbed = ErrorEmbed(
        '**Ссылка не ведёт на изображение или видео. Допустимые форматы: `png, jpeg, jpg, webp, bmp, gif, mp4`**',
      ).setFooter('Для gif-анимаций и видео в поиске будет использоваться первый кадр');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const traceClient = new TraceMoe();

    const response = await traceClient.fetchAnime(link, {
      cutBorders: true,
    });

    if (response.error) {
      const errorEmbed = ErrorEmbed(`**Произошла ошибка ${response.error}**`);
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }
    const anime = response.result.find((anime) => anime.similarity > 0.86);

    if (!anime) {
      const errorEmbed = ErrorEmbed('**Аниме не найдено**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
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
      .setFooter(`Что-бы узнать по подробнее об аниме введите команду >anilist ${anime.anilist}`);

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

    collector.on('collect', () => {
      client.commands.get('anilist').run({ client, message, args: [String(anime.anilist)] });
    });
  },
});
