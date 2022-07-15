import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { ExtendClient } from '../Client';
import { AutocompleteInteraction, CommandInteraction } from 'discord.js';

export interface SlashCommandRunOptions {
  client: ExtendClient;
  interaction: CommandInteraction<'cached'>;
}

export interface AutocompleteRunOptions {
  client: ExtendClient;
  interaction: AutocompleteInteraction;
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleAutocomplete(options: AutocompleteRunOptions) {
    return;
  }
}
