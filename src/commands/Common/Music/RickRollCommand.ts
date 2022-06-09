import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class RickRollCommand extends CommonCommand {
  name = 'rickRoll';
  category = 'Music';
  aliases = [];
  description = 'Never Gonna Give You Up';
  examples: CommandExample[] = [];
  usage = 'rickRoll';

  async run({ client, message }: CommandRunOptions) {
    client.commonCommands.get('play').run({ client, message, args: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'] });
  }
}

export default new RickRollCommand();
