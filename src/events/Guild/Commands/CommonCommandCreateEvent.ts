import { Collection, Message } from 'discord.js';
import Permissions from '../../../static/Permissions';
import { ExtendClient } from '../../../structures/Client';
import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendedMessage } from '../../../structures/ExtendedMessage';
import { isNumber } from '../../../utils/Common/Number';
import { ErrorEmbed } from '../../../utils/Discord/Embed';

class CommonCommandCreate extends DiscordEvent<'messageCreate'> {
  name: DiscordEventNames = 'messageCreate';

  async run(client: ExtendClient, message: Message) {
    if (
      !message.member ||
      !message.guild ||
      !message.guild.me ||
      message.author.bot ||
      message.channel.type === 'DM' ||
      message.system
    ) {
      return;
    }

    const prefix = await client.getPrefix(message.guild.id);

    if (!message.content.startsWith(prefix)) {
      return;
    }

    if (client.config.environment === 'development' && !client.getOwners().includes(message.author.id)) {
      const errorEmbed = ErrorEmbed(
        '**Включен режим разработки. Команды работают только для создателей бота, указанных в `ownersID`**',
      );
      message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift()?.toLowerCase() ?? '';
    const command = client.commonCommands.get(cmd) || client.commonCommands.get(client.aliases.get(cmd) || '');

    if (!command) {
      return;
    }

    if (command.ownerOnly && !client.getOwners().includes(message.author.id)) {
      const errorEmbed = ErrorEmbed('**У вас нет прав на эту команду**');
      message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (
      command.memberPermissions?.length &&
      !message.channel.permissionsFor(message.member).has(command.memberPermissions) &&
      !client.getOwners().includes(message.author.id)
    ) {
      message.channel.send(
        `У вас нет нужных прав для этого, вам нужно: ${command.memberPermissions
          .map((value) => `\`${Permissions[value]}\``)
          .join(', ')}`,
      );
      return;
    }

    const keys: Collection<string, string> = new Collection();
    const attributes: Set<string> = new Set();
    const cleanArgs: string[] = [];

    const KEY_REGEX = /^wl:.+/;
    const ATTRIBUTE_REGEX = /^-(.+)/;

    args.forEach((argument, index, array) => {
      if (KEY_REGEX.test(argument) && args.length >= index + 2) {
        return keys.set(argument, args[index + 1]);
      }

      if (ATTRIBUTE_REGEX.test(argument) && !isNumber(argument)) {
        return attributes.add(ATTRIBUTE_REGEX.exec(argument)[1]);
      }

      if (!KEY_REGEX.test(array[index - 1])) {
        cleanArgs.push(argument);
      }
    });

    const extendedMessage = ExtendedMessage.getInstance(message);

    if (attributes.has('help') || attributes.has('h')) {
      client.commonCommands.get('help').run({ client, message: extendedMessage, args: [command.name] });
      return;
    }

    command.run({ client, message: extendedMessage, args: cleanArgs, keys, attributes });
  }
}

export default new CommonCommandCreate();
