import { PermissionString } from 'discord.js';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class CreateQuote extends CommonCommand {
  name = 'createQuote';
  category = 'Utils';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'createQuote';
  memberPermissions: PermissionString[] = ['MANAGE_MESSAGES'];

  async run({ message, client, args }: CommandRunOptions) {
    const newQuote = args.join(' ');

    if (!newQuote) {
      message.sendError('**Вы не указали цитату**');
      return;
    }

    await client.service.addQuote(message.guild.id, newQuote, message.author.id);

    message.sendSuccess('**Цитата успешно добавлена**');
  }
}

export default new CreateQuote();
