import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class ResumeCommand extends CommonCommand {
  name = 'resume';
  category = 'Music';
  aliases = [];
  description = 'Возобновляет трек, если он остановлен';
  usage = 'resume';
  examples: CommandExample[] = [
    {
      command: 'resume',
      description: 'Возобновляет трек',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (queue.playing) {
      message.sendError('**Трек не приостановлен.**');
    }

    queue.resume();
    message.sendSuccess('**Трек был возобновлён.**');
  }
}

export default new ResumeCommand();
