import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class PauseCommand extends CommonCommand {
  name = 'pause';
  category = 'Music';
  aliases = ['hold', 'пауза'];
  description = 'Останавливает воспроизведение';
  usage = 'pause';
  examples: CommandExample[] = [
    {
      command: 'pause',
      description: 'Остановить воспроизведение текущего трека',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue.playing) {
      queue.resume();
      message.sendSuccess('**Трек был возобновлён.**');
      return;
    }

    queue.pause();
    message.sendSuccess('**Трек был приостановлен.**');
  }
}

export default new PauseCommand();
