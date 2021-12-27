import {ErrorEmbed} from '../../utils/Embed';
import {MessageEmbed} from 'discord.js';
import {Colors} from '../../static/Colors';
import {EmojisLinks} from '../../static/Emojis';
import {Command} from '../../structures/Command';

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

    const playlist = queue.songs
      .map((song, index) => {
        if (index === 0) {
          return `Сейчас играет: **${song.name}** - \`${song.formattedDuration}\` ${
            queue.songs.length > 1 ? '\n\n`Плейлист`' : ''
          }`;
        }

        return `➤ **${index}.** **${song.name}** - \`${song.formattedDuration}\``;
      })
      .join('\n');

    const embed = new MessageEmbed()
      .setAuthor('Плейлист', EmojisLinks.Headphone)
      .setDescription(playlist)
      .setColor(Colors.Green);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
