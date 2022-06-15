import { ExtendClient } from '../structures/Client';
import { Message } from 'discord.js';
import { ExtendedMessage } from '../structures/ExtendedMessage';

const NHENTAI_REGEX = /https?:\/\/(www\.)?nhentai\.(?:net|to)\/g\/(\d+)/;

export function NHentaiLink(client: ExtendClient, message: Message): void {
  const match = message.content.match(NHENTAI_REGEX);

  if (!match) {
    return;
  }

  const id = match[2];

  const extendedMessage = ExtendedMessage.getInstance(message);
  client.commonCommands.get('nhentai').run({ client, message: extendedMessage, args: [id] });
}
