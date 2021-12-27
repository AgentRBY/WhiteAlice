import {MessageEmbed} from 'discord.js';
import {Colors} from '../../static/Colors';
import {EmojisLinks} from '../../static/Emojis';
import {Event} from '../../structures/Event';
import {Playlist, Queue} from 'distube';
import {upFirstLetter} from '../../utils/strings';

export default new Event({
  name: 'addList',
  type: 'distube',
  run: (queue: Queue, playlist: Playlist) => {
    const embed = new MessageEmbed()
      .setAuthor('Музыка', EmojisLinks.Music)
      .setDescription(`Плейлист \`${playlist.name}\` из добавлен в очередь!`)
      .setFooter(`Добавлено из ${upFirstLetter(playlist.source)}`)
      .setColor(Colors.Green);

    queue.textChannel.send({ embeds: [embed] });
  },
});
