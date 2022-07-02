import { ExtendClient } from '../../structures/Client';
import { Collection, Guild } from 'discord.js';
import { DiscordEvent, DiscordEventNames } from '../../structures/Event';

class GuildCreate extends DiscordEvent<'guildCreate'> {
  name: DiscordEventNames = 'guildCreate';

  run(client: ExtendClient, guild: Guild) {
    guild.invites.fetch().then((guildInvites) => {
      if (guild.me.permissions.has('MANAGE_GUILD')) {
        client.invites.set(guild.id, new Collection(guildInvites.map((invite) => [invite.code, invite.uses])));
      }
    });
  }
}

export default new GuildCreate();
