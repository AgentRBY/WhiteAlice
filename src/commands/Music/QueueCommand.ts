import { ErrorEmbed } from '../../utils/Discord/Embed';
import { MessageActionRow, MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { EmojisLinks } from '../../static/Emojis';
import { Command } from '../../structures/Command';
import { Song } from 'distube';
import { generateDefaultButtons, pagination } from '../../utils/Discord/Pagination';

export default new Command({
  name: 'queue',
  category: 'Music',
  aliases: ['q', 'playlist', 'плейлист', 'очередь'],
  description: 'Показывает плейлист со всеми треками добавленными в очередь',
  usage: 'queue',
  examples: [
    {
      command: 'queue',
      description: 'Показывает список треков',
    },
  ],
  run: async ({ client, message }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const songsPerPage = 20;

    const generateEmbed = (songs: Song[], page: number, pages: number) => {
      const embed = new MessageEmbed()
        .setAuthor({ name: 'Плейлист', iconURL: EmojisLinks.Headphone })
        .setColor(Colors.Green)
        .setFooter({ text: `Страница ${page}/${pages}` });

      const description = songs
        .map((song, index) => {
          return `➤ **${songsPerPage * (page - 1) + (index + 1)}.** **${song.name}** - ${song.uploader.name} (\`${
            song.formattedDuration
          }\`)`;
        })
        .join('\n');

      embed.setDescription(description);

      return embed;
    };

    const pagesCount = Math.ceil(queue.songs.length / songsPerPage);

    const pages = [...new Array(pagesCount)].map((_, index) => {
      const page = index + 1;

      const songsStartCount = songsPerPage * (page - 1);
      const songsEndCount = page === pagesCount ? queue.songs.length : songsStartCount + songsPerPage;

      const songs = queue.songs.slice(songsStartCount, songsEndCount);

      return generateEmbed(songs, page, pagesCount);
    });

    const paginationButtons = new MessageActionRow().addComponents(generateDefaultButtons(pages.length));
    const firstPageEmbed = generateEmbed(queue.songs.slice(0, 20), 1, pagesCount);

    const replyMessage = await message.reply({
      embeds: [firstPageEmbed],
      components: [paginationButtons],
      allowedMentions: { repliedUser: false },
    });

    pagination(replyMessage, pages);
  },
});
