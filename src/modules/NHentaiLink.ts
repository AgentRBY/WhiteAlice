import { ExtendClient } from '../structures/Client';
import { Message } from 'discord.js';

const NHENTAI_REGEX = /https?:\/\/(www\.)?nhentai\.(?:net|to)\/g\/(\d+)/;

export function NHentaiLink(client: ExtendClient, message: Message): void {
  const match = message.content.match(NHENTAI_REGEX);

  if (!match) {
    return;
  }

  const id = match[2];

  client.commonCommands.get('nhentai').run({ client, message, args: [id] });
}
