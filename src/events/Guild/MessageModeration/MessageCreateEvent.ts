import { Message } from 'discord.js';
import { AntiPingModule } from '../../../modules/AntiPing';
import { AntiScamModule } from '../../../modules/AntiScam';
import { MediaChannel } from '../../../modules/MediaChannel';
import { ExtendClient } from '../../../structures/Client';
import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendedMessage } from '../../../structures/ExtendedMessage';
import { getMemberBaseId } from '../../../utils/Other';
import { AutoAnswerModule } from '../../../modules/AutoAnswer';

class MessageModeration extends DiscordEvent<'messageCreate'> {
  name: DiscordEventNames = 'messageCreate';

  run(client: ExtendClient, message: Message) {
    if (
      !message.member ||
      !message.guild ||
      !message.guild.members.me ||
      message.channel.type === 'DM' ||
      message.member.user.bot ||
      message.system
    ) {
      return;
    }

    AntiScamModule(client, message);
    AntiPingModule(client, message);
    AutoAnswerModule(client, message);

    if (!client.config.mongoURI) {
      return;
    }

    MediaChannel(client, message);

    client.service.incrementMessageCount(getMemberBaseId(message.member));

    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
      const extendedMessage = ExtendedMessage.getInstance(message);

      client.commonCommands.get('ping').run({
        client,
        message: extendedMessage,
        args: [],
      });
      return;
    }
  }
}

export default new MessageModeration();
