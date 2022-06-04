import { ErrorEmbed } from '../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class NowPlayingCommand extends Command {
  name = 'nowPlaying';
  category = 'Music';
  aliases = ['np'];
  description = 'Показывает песню, которая сейчас играет';
  examples: CommandExample[] = [
    {
      command: 'nowPlaying',
      description: 'Покажет текущую песню',
    },
  ];
  usage = 'nowPlaying';

  async run({ client, message }: CommandRunOptions) {
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
  }
}

export default new NowPlayingCommand();
