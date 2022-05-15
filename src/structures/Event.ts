import { EventType } from '../typings/Event';

export class Event {
  constructor(eventOptions: EventType) {
    Object.assign(this, eventOptions);
  }
}
