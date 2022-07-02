import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction } from 'discord.js';

class ContextCommandCreate extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  run(client: ExtendClient, interaction: Interaction) {
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
  }
}

export default new ContextCommandCreate();
