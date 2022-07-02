import { ExtendClient } from '../../structures/Client';
import { Guild } from 'discord.js';
import { DiscordEvent, DiscordEventNames } from '../../structures/Event';

class GuildDelete extends DiscordEvent<'guildDelete'> {
  name: DiscordEventNames = 'guildDelete';

  run(client: ExtendClient, guild: Guild) {
    client.invites.delete(guild.id);
  }
}

export default new GuildDelete();
