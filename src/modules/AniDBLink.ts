import { ExtendClient } from '../structures/Client';
import { Message } from 'discord.js';

const ANIDB_REGEX = /https?:\/\/(www\.)?anidb\.net\/anime\/(\d+)/;

export function AniDBLink(client: ExtendClient, message: Message): void {
  const match = message.content.match(ANIDB_REGEX);

  if (!match) {
    return;
  }

  const id = match[2];

  client.commands.get('anidb').run({ client, message, args: [id] });
}
