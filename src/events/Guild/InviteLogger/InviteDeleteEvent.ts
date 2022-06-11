import { Event } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Invite } from 'discord.js';

export default new Event({
  name: 'inviteDelete',
  run: async (client: ExtendClient, invite: Invite) => {
    client.invites.get(invite.guild.id).delete(invite.code);
  },
});
