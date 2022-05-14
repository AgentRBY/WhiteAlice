import { Event } from '../../structures/Event';
import { Collection, Message } from 'discord.js';
import { ExtendClient } from '../../structures/Client';
import { AntiScamModule } from '../../modules/AntiScam';
import { ErrorEmbed } from '../../utils/Embed';
import Permissions from '../../static/Permissions';
import { GuildModel } from '../../models/GuildModel';
import { AntiPingModule } from '../../modules/AntiPing';
import { NHentaiLink } from '../../modules/NHentaiLink';
import { AniDBLink } from '../../modules/AniDBLink';
import { AnilistLink } from '../../modules/AnilistLink';
import { MemberModel } from '../../models/MemberModel';
import { MediaChannel } from '../../modules/MediaChannel';

export default new Event({
  name: 'messageCreate',
  run: async (client: ExtendClient, message: Message) => {
    if (!message.member || !message.guild || !message.guild.me || message.channel.type === 'DM') {
      return;
    }

    if (client.config.mode === 'development' && !client.getOwners().includes(message.author.id)) {
      return;
    }

    let GuildData = await client.guildBase.get(message.guildId);

    if (!GuildData) {
      GuildData = await GuildModel.create({
        _id: message.guildId,
        prefix: client.config.prefix || '>',
      });

      await GuildData.save();
    }

    AntiScamModule(client, message);
    AntiPingModule(client, message);

    NHentaiLink(client, message);
    AniDBLink(client, message);
    AnilistLink(client, message);

    MediaChannel(client, message, GuildData);

    let MemberData = await client.memberBase.get(`${message.author.id}-${message.guildId}`);

    if (!MemberData) {
      MemberData = await MemberModel.create({
        _id: `${message.author.id}-${message.guildId}`,
      });

      await MemberData.save();
    }

    MemberData.messageCount++;
    MemberData.save();

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      client.commands.get('ping').run({ client, message, args: [] });
      return;
    }

    if (client.config.mode === 'testing' && !GuildData.testersID?.includes(message.author.id)) {
      const errorEmbed = ErrorEmbed('**Включен режим тестирования. Использование бота доступно только тестерам**');
      message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      return;
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

    if (command.ownerOnly && !client.getOwners().includes(message.author.id)) {
      const errorEmbed = ErrorEmbed('**У вас нет прав на эту команду**');
      message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (
      command.testersOnly &&
      (!GuildData.testersID?.includes(message.author.id) || !client.getOwners().includes(message.author.id))
    ) {
      const errorEmbed = ErrorEmbed('**Это команда доступна только тестировщикам**');
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

    command.run({ client, message, args: cleanArgs, keys, attributes, GuildData, MemberData });
  },
});
