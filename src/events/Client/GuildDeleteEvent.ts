import {Event} from '../../structures/Event';
import {ExtendClient} from '../../structures/Client';
import {Guild} from 'discord.js';

export default new Event({
  name: 'guildDelete',
  run: async (client: ExtendClient, guild: Guild) => {
    client.invites.delete(guild.id);
  },
});
