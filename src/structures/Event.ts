import { Awaitable, ClientEvents } from 'discord.js';
import { DisTubeEvents } from 'distube';
import { ExtendClient } from './Client';

export type DisTubeEventNames = keyof DisTubeEvents;
export type DiscordEventNames = keyof ClientEvents;

export abstract class DisTubeEvent<T extends DisTubeEventNames> {
  abstract name: DisTubeEventNames;

  abstract run(client: ExtendClient, ...options: Parameters<DisTubeEvents[T]>): Awaitable<void>;
}

export abstract class DiscordEvent<T extends DiscordEventNames> {
  abstract name: DiscordEventNames;

  abstract run(client: ExtendClient, ...options: ClientEvents[T]): Awaitable<void>;
}
