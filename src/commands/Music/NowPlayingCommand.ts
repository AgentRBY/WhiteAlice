import { Command } from '../../structures/Command';
import { client } from '../../app';
import { ErrorEmbed } from '../../utils/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';

export default new Command({
  name: 'nowPlaying',
  category: 'Music',
  aliases: ['np'],
  description: '',
  examples: [],
  usage: 'nowPlaying',
  run: async ({ message }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const song = queue.songs[0];

    const embed = new MessageEmbed()
      .setDescription(`${Emojis.Headphone} **Сейчас играет: \`${song.name}\` - ${song.uploader.name}**`)
      .setColor(Colors.Green)
      .setImage(song.thumbnail);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
