import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { sleep } from '../../utils/Other';
import { Collection } from 'discord.js';

export default new Event({
  name: 'ready',
  run: async (client: ExtendClient) => {
    await sleep(1000);
    console.log('Start fetching invites');

    client.guilds.cache.forEach(async (guild) => {
      if (guild.me.permissions.has('MANAGE_GUILD')) {
        const firstInvites = await guild.invites.fetch();
        client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
      }
    });

    console.log(`${client.user.username} ready`);
  },
});
