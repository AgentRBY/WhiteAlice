import {Event} from '../../structures/Event';
import {Collection, Message} from 'discord.js';
import {ExtendClient} from '../../structures/Client';
import {ScamModule} from '../../modules/Scam';
import {ErrorEmbed} from '../../utils/Embed';
import Permissions from '../../static/Permissions';
import {GuildModel} from '../../models/GuildModel';

export default new Event({
  name: 'messageCreate',
  run: async (client: ExtendClient, message: Message) => {
    if (!message.member || !message.guild || !message.guild.me || message.channel.type === 'DM') {
      return;
    }

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      client.commands.get('ping').run({ client, message, args: [] });
      return;
    }

    ScamModule(client, message);
    let GuildData = await GuildModel.findById(message.guildId);

    if (!GuildData) {
      GuildData = await GuildModel.create({
        _id: message.guildId,
        prefix: client.config.prefix || '>',
      });

      await GuildData.save();
    }

    const prefix = GuildData.prefix || client.config.prefix || '>';

    if (!message.content.startsWith(prefix)) {
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift()?.toLowerCase() ?? '';
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd) || '');

    if (!command) {
      return;
    }

    if (command.ownerOnly && !client.config.ownersID.split(',').includes(message.author.id)) {
      const errorEmbed = ErrorEmbed('**У вас нет прав на эту команду**');
      message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (
      command.memberPermissions?.length &&
      !message.channel.permissionsFor(message.member).has(command.memberPermissions)
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

    const KEY_REGEX = /^hl:.+/;
    const ATTRIBUTE_REGEX = /^-(.+)/;

    args.forEach((argument, index, array) => {
      if (KEY_REGEX.test(argument) && args.length >= index + 2) {
        return keys.set(argument, args[index + 1]);
      }

      if (ATTRIBUTE_REGEX.test(argument)) {
        return attributes.add(ATTRIBUTE_REGEX.exec(argument)[1]);
      }

      if (!KEY_REGEX.test(array[index - 1])) {
        cleanArgs.push(argument);
      }
    });

    if (attributes.has('help') || attributes.has('h')) {
      client.commands.get('help').run({ client, message, args: [command.name] });
      return;
    }

    command.run({ client, message, args: cleanArgs, keys, attributes, GuildData });
  },
});
