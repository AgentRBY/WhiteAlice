import { TextChannel } from 'discord.js';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsUserInVoice } from '../../../utils/Decorators/MusicDecorators';

class PlayCommand extends CommonCommand {
  name = 'play';
  category = 'Music';
  aliases = ['p', 'плэй', 'музыка', 'запустить', 'addSong'];
  description = 'Проиграть трек. Поддерживает запросы и ссылки на YouTube, ссылки на плейлисты в Spotify и SoundCloud';
  usage = 'play <запрос>';
  examples: CommandExample[] = [
    {
      command: 'play Never Gonna Give You Up',
      description: 'Воспроизводит `Never Gonna Give You Up` от `Rick Astley`',
    },
    {
      command: 'play https://open.spotify.com/playlist/69l7D0fGepx502NI7YfVdz',
      description: 'Воспроизводит `Lo-fi gaming beats` плейлист из Spotify',
    },
  ];

  @IsUserInVoice()
  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!args.length && queue?.playing) {
      queue.resume();
      message.sendSuccess('**Трек был возобновлён**');
      return;
    }

    if (!args.length) {
      message.sendError('**Вы не указали запрос**');
      return;
    }

    try {
      await client.disTube.play(message.member.voice.channel, args.join(' '), {
        message,
        member: message.member,
        textChannel: message.channel as TextChannel,
      });
    } catch (error) {
      client.disTube.emit('error', message.channel as TextChannel, error);
    }
  }
}

export default new PlayCommand();
