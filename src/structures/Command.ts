import { Collection, Message, PermissionString } from 'discord.js';
import { ExtendClient } from './Client';

export interface CommandExample {
  command: string;
  description: string;
}

export interface CommandRunOptions {
  client: ExtendClient;
  message: Message;
  args: string[];
  keys?: Collection<string, string>;
  attributes?: Set<string>;
}

export class Command {
  name: string;
  category: string;
  description: string;
  usage: string;
  examples: CommandExample[];

  aliases?: string[];
  memberPermissions?: PermissionString[];
  botPermissions?: PermissionString[];
  ownerOnly?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(options: Partial<CommandRunOptions>): unknown {
    return;
  }
}
