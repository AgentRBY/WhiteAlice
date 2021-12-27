import {MessageEmbed} from 'discord.js';
import {Colors} from '../../static/Colors';
import {EmojisLinks} from '../../static/Emojis';
import {Event} from '../../structures/Event';
import {Queue, Song} from 'distube';

export default new Event({
  name: 'addSong',
  type: 'distube',
  run: (queue: Queue, song: Song) => {
    const embed = new MessageEmbed()
      .setAuthor('Музыка', EmojisLinks.Music)
      .setDescription(`Трек **${song.name}** был добавлен в плейлист`)
      .setFooter(`Длительность: ${song.formattedDuration}`)
      .setColor(Colors.Green);

    queue.textChannel.send({ embeds: [embed] });
  },
});
