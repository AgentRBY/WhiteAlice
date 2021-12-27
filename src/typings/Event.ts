import {ClientEvents} from 'discord.js';
import {DisTubeEvents} from 'distube';

type Awaitable = Promise<void> | void;

export interface EventType {
  name: keyof ClientEvents | keyof DisTubeEvents;
  run: EventRun;
  type?: 'discord' | 'distube';
}

type EventRun = (...options: unknown[]) => Awaitable;
