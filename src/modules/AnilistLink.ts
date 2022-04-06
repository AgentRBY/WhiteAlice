import { ExtendClient } from '../structures/Client';
import { Message } from 'discord.js';

const ANILIST_REGEX = /https?:\/\/(www\.)?anilist\.co\/anime\/(\d+)/;

export function AnilistLink(client: ExtendClient, message: Message): void {
  const match = message.content.match(ANILIST_REGEX);

  if (!match) {
    return;
  }

  const id = match[2];

  client.commands.get('anilist').run({ client, message, args: [id] });
}