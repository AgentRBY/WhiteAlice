import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction } from 'discord.js';

class SlashCommandAutocompleteCreate extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  run(client: ExtendClient, interaction: Interaction) {
    if (!interaction.isAutocomplete()) {
      return;
    }

    if (!client.slashCommands.has(interaction.commandName)) {
      return;
    }

    const command = client.slashCommands.get(interaction.commandName);
    command.handleAutocomplete({ client, interaction });
  }
}

export default new SlashCommandAutocompleteCreate();
