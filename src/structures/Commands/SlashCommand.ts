import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { ExtendClient } from '../Client';
import { CommandInteraction } from 'discord.js';

export interface SlashCommandRunOptions {
  client: ExtendClient;
  interaction: CommandInteraction;
}

export class SlashCommand {
  meta:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(options: SlashCommandRunOptions) {
    return;
  }
}
