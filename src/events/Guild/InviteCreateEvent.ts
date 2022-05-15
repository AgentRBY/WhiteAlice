import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { Invite } from 'discord.js';

export default new Event({
  name: 'inviteCreate',
  type: 'discord',
  run: (client: ExtendClient, invite: Invite) => {
    client.invites.get(invite.guild.id).set(invite.code, invite.uses);
  },
});
