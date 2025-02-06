import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Message } from 'discord.js';
import { promisify } from 'util';

const request = promisify(require('request'));

class PreserveImageFromDeleteEvent extends DiscordEvent<'messageDelete'> {
  name: DiscordEventNames = 'messageDelete';

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

    if (message.attachments.size) {
      try {
        message.attachments.forEach((attachment) => {
          request(attachment.url);
          request(attachment.proxyURL);
        });
      } catch {}
    }
  }
}

export default new PreserveImageFromDeleteEvent();
