import { ErrorEmbed } from '../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import { EmojisLinks } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { Command, CommandRunOptions } from '../../structures/Command';

class PlayNextCommand extends Command {
  name = 'playNext';
  category = 'Music';
  aliases = ['pn'];
  description = `Проиграть трек следующим в очереди. Во всем остальном аналогичен команде >play. 
     Имеет ключ -S, который позволяет сразу пропускать текущую песню при добавлении`;
  examples = [
    {
      command: 'playNext Never Gonna Give You Up',
      description: 'Добавляет `Never Gonna Give You Up` от `Rick Astley` следующим в очередь',
    },
    {
      command: 'playNext Never Gonna Give You Up -S',
      description: 'Добавляет `Never Gonna Give You Up` от `Rick Astley` следующим в очередь и пропускает текущий трек',
    },
  ];
  usage = 'playNext <запрос>';

  async run({ client, message, args, attributes }: CommandRunOptions) {
    if (!message.member?.voice.channel) {
      const embed = ErrorEmbed('**Вы не находитесь в голосовом канале**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    if (!args.length) {
      const embed = ErrorEmbed('**Вы не указали запрос**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    const skipSong = attributes.has('S') || attributes.has('s');
    await client.disTube.play(message.member.voice.channel, args.join(' '), {
      position: 1,
      skip: skipSong,
    });

    const queue = client.disTube.getQueue(message);
    if (skipSong && queue.songs.length > 1) {
      const addedSong = queue.songs[1];

      const embed = new MessageEmbed()
        .setAuthor({ name: 'Музыка', iconURL: EmojisLinks.Music })
        .setDescription(`Трек **${addedSong.name}** был добавлен в плейлист и текущая песня **пропущена**`)
        .setFooter({ text: `Длительность: ${addedSong.formattedDuration}` })
        .setColor(Colors.Green);
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  }
}

export default new PlayNextCommand();
