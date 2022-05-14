import { ClientEvents } from 'discord.js';
import { DisTubeEvents } from 'distube';

type Awaitable = Promise<void> | void;

export type EventType = DisTubeEvent | DiscordEvent;

export interface DisTubeEvent {
  name: keyof DisTubeEvents;
  run: EventRun;
  type?: 'distube';
}

export interface DiscordEvent {
  name: keyof ClientEvents;
  run: EventRun;
  type?: 'discord';
}

type EventRun = (...options: unknown[]) => Awaitable;
