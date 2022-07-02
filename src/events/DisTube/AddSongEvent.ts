import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { EmojisLinks } from '../../static/Emojis';
import { DisTubeEvent, DisTubeEventNames } from '../../structures/Event';
import { Queue, Song } from 'distube';
import { ExtendClient } from '../../structures/Client';

class GuildDelete extends DisTubeEvent<'addSong'> {
  name: DisTubeEventNames = 'addSong';

  run(client: ExtendClient, queue: Queue, song: Song) {
    const embed = new MessageEmbed()
      .setAuthor({
        name: 'Музыка',
        iconURL: EmojisLinks.Music,
      })
      .setDescription(`Трек **${song.name}** был добавлен в плейлист`)
      .setFooter({ text: `Длительность: ${song.formattedDuration}` })
      .setColor(Colors.Green);

    queue.textChannel.send({ embeds: [embed] });
  }
}

export default new GuildDelete();
