import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class RickRollCommand extends Command {
  name = 'rickRoll';
  category = 'Music';
  aliases = [];
  description = 'Never Gonna Give You Up';
  examples: CommandExample[] = [];
  usage = 'rickRoll';

  async run({ client, message }: CommandRunOptions) {
    client.commands.get('play').run({ client, message, args: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'] });
  }
}

export default new RickRollCommand();
