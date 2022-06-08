import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { Collection } from 'discord.js';
import { Activities } from '../../static/Activities';
import { getRandomInt } from '../../utils/Common/Number';
import { sleep } from '../../utils/Common/Strings';
import Logger from '../../utils/Logger';

export default new Event({
  name: 'ready',
  run: async (client: ExtendClient) => {
    Logger.success(`${client.user.username} ready`);
    await client.guilds.fetch();
    Logger.info(`Working on ${client.guilds.cache.size} guilds`);
    Logger.info(`Active ${client.commands.size} commands on ${client.categories.size} categories`);

    await sleep(1000);

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
  },
});
