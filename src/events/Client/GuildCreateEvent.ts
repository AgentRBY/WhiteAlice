import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { Collection, Guild } from 'discord.js';

export default new Event({
  name: 'guildCreate',
  run: async (client: ExtendClient, guild: Guild) => {
    guild.invites.fetch().then((guildInvites) => {
      client.invites.set(guild.id, new Collection(guildInvites.map((invite) => [invite.code, invite.uses])));
    });
  },
});
