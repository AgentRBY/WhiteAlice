import { Awaitable, ClientEvents } from 'discord.js';
import { ExtendClient } from './Client';

export type DiscordEventNames = keyof ClientEvents;

export abstract class DiscordEvent<T extends DiscordEventNames> {
  abstract name: DiscordEventNames;

  abstract run(client: ExtendClient, ...options: ClientEvents[T]): Awaitable<void>;
}
