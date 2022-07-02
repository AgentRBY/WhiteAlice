import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { Message } from 'discord.js';
import { ExtendClient } from '../../../structures/Client';
import { AntiScamModule } from '../../../modules/AntiScam';
import { AntiPingModule } from '../../../modules/AntiPing';
import { NHentaiLink } from '../../../modules/NHentaiLink';
import { AniDBLink } from '../../../modules/AniDBLink';
import { AnilistLink } from '../../../modules/AnilistLink';
import { MediaChannel } from '../../../modules/MediaChannel';
import { getMemberBaseId } from '../../../utils/Other';
import { ExtendedMessage } from '../../../structures/ExtendedMessage';

class MessageModeration extends DiscordEvent<'messageCreate'> {
  name: DiscordEventNames = 'messageCreate';

  run(client: ExtendClient, message: Message) {
    if (!message.member || !message.guild || !message.guild.me || message.channel.type === 'DM' || message.system) {
      return;
    }

    AntiScamModule(client, message);
    AntiPingModule(client, message);

    NHentaiLink(client, message);
    AniDBLink(client, message);
    AnilistLink(client, message);

    MediaChannel(client, message);

    client.service.incrementMessageCount(getMemberBaseId(message.member));

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      const extendedMessage = ExtendedMessage.getInstance(message);

      client.commonCommands.get('ping').run({ client, message: extendedMessage, args: [] });
      return;
    }
  }
}

export default new MessageModeration();
