import { Message } from 'discord.js';
import { insertMethods } from '../utils/Other';

export class ExtendedMessage {
  public static getInstance(message: Message): ExtendedMessage & Message {
    return insertMethods(message, ExtendedMessage);
  }
}
