import { Event } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Collection, Guild, Invite } from 'discord.js';

export default new Event({
  name: 'inviteCreate',
  type: 'discord',
  run: async (client: ExtendClient, invite: Invite) => {
    const invites = await (invite.guild as Guild).invites?.fetch();

    if (!invites) {
      return;
    }

    const codeUses = new Collection<string, number>();
    invites.each((inv) => codeUses.set(inv.code, inv.uses));

    client.invites.set(invite.guild.id, codeUses);
  },
});
