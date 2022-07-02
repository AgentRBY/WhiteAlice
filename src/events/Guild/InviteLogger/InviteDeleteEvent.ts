import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Invite } from 'discord.js';

class InviteDelete extends DiscordEvent<'inviteDelete'> {
  name: DiscordEventNames = 'inviteDelete';

  run(client: ExtendClient, invite: Invite) {
    client.invites.get(invite.guild.id).delete(invite.code);
  }
}

export default new InviteDelete();
