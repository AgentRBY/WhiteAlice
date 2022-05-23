import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { sleep } from '../../utils/Other';
import { Collection } from 'discord.js';
import { Activities } from '../../static/Activities';
import { getRandomInt } from '../../utils/Number';

export default new Event({
  name: 'ready',
  run: async (client: ExtendClient) => {
    await sleep(1000);
    console.log('Start fetching invites');

    client.guilds.cache.forEach(async (guild) => {
      if (guild.me.permissions.has('MANAGE_GUILD')) {
        const fetchedInvites = await guild.invites.fetch();
        // client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
        const codeUses = new Collection<string, number>();
        fetchedInvites.each((invite) => codeUses.set(invite.code, invite.uses));

        client.invites.set(guild.id, codeUses);
      }
    });

    setInterval(() => {
      client.user.setActivity(Activities[getRandomInt(0, Activities.length - 1)]);
    }, 120_000);

    console.log(`${client.user.username} ready`);
  },
});
