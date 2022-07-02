import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { EmojisLinks } from '../../static/Emojis';
import { DisTubeEvent, DisTubeEventNames } from '../../structures/Event';
import { Playlist, Queue } from 'distube';
import { upFirstLetter } from '../../utils/Common/Strings';
import { ExtendClient } from '../../structures/Client';

class GuildDelete extends DisTubeEvent<'addList'> {
  name: DisTubeEventNames = 'addList';

  run(client: ExtendClient, queue: Queue, playlist: Playlist) {
    const embed = new MessageEmbed()
      .setAuthor({ name: 'Музыка', iconURL: EmojisLinks.Music })
      .setDescription(`Плейлист \`${playlist.name}\` из добавлен в очередь!`)
      .setFooter({ text: `Добавлено из ${upFirstLetter(playlist.source)}` })
      .setColor(Colors.Green);

    queue.textChannel.send({ embeds: [embed] });
  }
}

export default new GuildDelete();
