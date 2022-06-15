import { PermissionString } from 'discord.js';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class PrefixCommand extends CommonCommand {
  name = 'prefix';
  category = 'Administration';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'update';
  memberPermissions: PermissionString[] = ['MANAGE_GUILD'];

  async run({ client, message, args }: CommandRunOptions) {
    const prefix = args[0];

    if (!prefix) {
      message.sendError('Укажите префикс');
      return;
    }

    if (prefix.length > 3) {
      message.sendError('Длинна префикса не может быть больше 3 символов');
      return;
    }

    client.service.setPrefix(message.guildId, prefix);

    message.sendSuccess(`Префикс успешно изменён на \`${prefix}\``);
  }
}

export default new PrefixCommand();
