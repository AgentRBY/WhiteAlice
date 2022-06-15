import { ExtendClient } from '../structures/Client';
import { Message } from 'discord.js';
import { ExtendedMessage } from '../structures/ExtendedMessage';

const ANIDB_REGEX = /https?:\/\/(www\.)?anidb\.net\/anime\/(\d+)/;

export function AniDBLink(client: ExtendClient, message: Message): void {
  const match = message.content.match(ANIDB_REGEX);

  if (!match) {
    return;
  }

  const id = match[2];

  const extendedMessage = ExtendedMessage.getInstance(message);
  client.commonCommands.get('anidb').run({ client, message: extendedMessage, args: [id] });
}
