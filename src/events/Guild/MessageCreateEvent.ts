import { Event } from '../../structures/Event';
import { Collection, Message } from 'discord.js';
import { ExtendClient } from '../../structures/Client';
import { AntiScamModule } from '../../modules/AntiScam';
import { ErrorEmbed } from '../../utils/Discord/Embed';
import Permissions from '../../static/Permissions';
import { AntiPingModule } from '../../modules/AntiPing';
import { NHentaiLink } from '../../modules/NHentaiLink';
import { AniDBLink } from '../../modules/AniDBLink';
import { AnilistLink } from '../../modules/AnilistLink';
import { MediaChannel } from '../../modules/MediaChannel';
import { getMemberBaseId } from '../../utils/Other';

export default new Event({
  name: 'messageCreate',
  run: async (client: ExtendClient, message: Message) => {
    if (!message.member || !message.guild || !message.guild.me || message.channel.type === 'DM' || message.system) {
      return;
    }

    if (client.config.mode === 'development' && !client.getOwners().includes(message.author.id)) {
      return;
    }

    AntiScamModule(client, message);
    AntiPingModule(client, message);

    NHentaiLink(client, message);
    AniDBLink(client, message);
    AnilistLink(client, message);

    MediaChannel(client, message);

    client.service.incrementMessageCount(getMemberBaseId(message.member));

    if ((await client.service.getKarma(getMemberBaseId(message.member))) === undefined) {
      client.service.recalculateKarma(getMemberBaseId(message.member));
    }

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      client.commands.get('ping').run({ client, message, args: [] });
      return;
    }

    const prefix = await client.service.getPrefix(message.guildId);

    if (!message.content.startsWith(prefix)) {
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift()?.toLowerCase() ?? '';
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd) || '');

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

    command.run({ client, message, args: cleanArgs, keys, attributes });
  },
});
