import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction } from 'discord.js';

class SlashCommandCreate extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  run(client: ExtendClient, interaction: Interaction) {
    if (!interaction.inCachedGuild()) {
      return;
    }

    if (!interaction.isCommand()) {
      return;
    }

    if (!client.slashCommands.has(interaction.commandName)) {
      return;
    }

    const command = client.slashCommands.get(interaction.commandName);
    command.run({ client, interaction });
  }
}

export default new SlashCommandCreate();
