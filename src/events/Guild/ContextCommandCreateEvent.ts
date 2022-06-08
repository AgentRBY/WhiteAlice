import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { Interaction } from 'discord.js';

export default new Event({
  name: 'interactionCreate',
  type: 'discord',
  run: async (client: ExtendClient, interaction: Interaction) => {
    if (!interaction.isContextMenu()) {
      return;
    }

    if (!interaction.isMessageContextMenu() && !interaction.isUserContextMenu()) {
      return;
    }

    if (!client.contextCommands.has(interaction.commandName)) {
      return;
    }

    const command = client.contextCommands.get(interaction.commandName);
    command.run({ interaction, client });
  },
});
