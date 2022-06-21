import { Event } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction } from 'discord.js';

export default new Event({
  name: 'interactionCreate',
  type: 'discord',
  run: async (client: ExtendClient, interaction: Interaction) => {
    if (!interaction.isAutocomplete()) {
      return;
    }

    if (!client.slashCommands.has(interaction.commandName)) {
      return;
    }

    const command = client.slashCommands.get(interaction.commandName);
    command.handleAutocomplete({ client, interaction });
  },
});
