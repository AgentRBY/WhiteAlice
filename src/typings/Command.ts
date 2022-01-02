import { Collection, Message, PermissionString } from 'discord.js';
import { ExtendClient } from '../structures/Client';
import { IGuildModel } from './GuildModel';
import { Document } from 'mongoose';

export interface CommandType {
  name: string;
  category: string;
  description: string;
  usage: string;
  examples: CommandExample[];
  run: CommandRun;

  aliases?: string[];
  memberPermissions?: PermissionString[];
  botPermissions?: PermissionString[];
  ownerOnly?: true;
  testersOnly?: true;
}

interface CommandExample {
  command: string;
  description: string;
}

type CommandRun = (options: CommandRunOptions) => unknown;

interface CommandRunOptions {
  client: ExtendClient;
  message: Message;
  args: string[];
  GuildData?: Document<unknown, unknown, IGuildModel> & IGuildModel;
  keys?: Collection<string, string>;
  attributes?: Set<string>;
}
