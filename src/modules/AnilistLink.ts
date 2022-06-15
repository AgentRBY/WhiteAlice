import { ExtendClient } from '../structures/Client';
import { Message } from 'discord.js';
import { ExtendedMessage } from '../structures/ExtendedMessage';

const ANILIST_REGEX = /https?:\/\/(www\.)?anilist\.co\/anime\/(\d+)/;

export function AnilistLink(client: ExtendClient, message: Message): void {
  const match = message.content.match(ANILIST_REGEX);

  if (!match) {
    return;
  }

  const id = match[2];

  const extendedMessage = ExtendedMessage.getInstance(message);
  client.commonCommands.get('anilist').run({ client, message: extendedMessage, args: [id] });
}
