import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Collection, Guild, Invite } from 'discord.js';

class InviteCreate extends DiscordEvent<'inviteCreate'> {
  name: DiscordEventNames = 'inviteCreate';

  async run(client: ExtendClient, invite: Invite) {
    const invites = await (invite.guild as Guild).invites?.fetch();

    if (!invites) {
      return;
    }

    const codeUses = new Collection<string, number>();
    invites.each((inv) => codeUses.set(inv.code, inv.uses));

    client.invites.set(invite.guild.id, codeUses);
  }
}

export default new InviteCreate();
