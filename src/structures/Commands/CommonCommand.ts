import { Collection, Message, PermissionString } from 'discord.js';
import { ExtendClient } from '../Client';
import { ExtendedMessage } from '../ExtendedMessage';

export interface CommandExample {
  command: string;
  description: string;
}

export interface CommandRunOptions {
  client: ExtendClient;
  message: ExtendedMessage & Message;
  args: string[];
  keys?: Collection<string, string>;
  attributes?: Set<string>;
}

export class CommonCommand {
  name: string;
  category: string;
  description: string;
  usage: string;
  examples: CommandExample[];

  aliases?: string[];
  memberPermissions?: PermissionString[];
  botPermissions?: PermissionString[];
  ownerOnly?: boolean;
  hide?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(options: Partial<CommandRunOptions>): unknown {
    return;
  }
}
