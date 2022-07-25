import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class StopCommand extends CommonCommand {
  name = 'stop';
  category = 'Music';
  aliases = ['leave', 'disconnect'];
  description = 'Завершает работу бота и выходит из канала';
  usage = 'stop';
  examples: CommandExample[] = [
    {
      command: 'stop',
      description: 'Завершает работу бота',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    await queue.stop();

    message.sendSuccess('**Выхожу...**');
  }
}

export default new StopCommand();
