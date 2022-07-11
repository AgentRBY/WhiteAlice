import { ExtendClient } from '../Client';
import { MessageContextMenuInteraction, PermissionString, UserContextMenuInteraction } from 'discord.js';

export type ContextCommandType = 'USER' | 'MESSAGE';

export interface ContextCommandRunOptions<T extends ContextCommandType> {
  client: ExtendClient;
  interaction: T extends 'USER' ? UserContextMenuInteraction : MessageContextMenuInteraction;
}

export type ContextCommandRun<T extends ContextCommandType> = Partial<ContextCommandRunOptions<T>>;

export class ContextCommand {
  name: string;
  type: ContextCommandType;
  memberPermission?: PermissionString[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(options: ContextCommandRun<ContextCommandType>) {
    return;
  }
}
