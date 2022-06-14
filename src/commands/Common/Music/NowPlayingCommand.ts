import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class NowPlayingCommand extends CommonCommand {
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

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

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
