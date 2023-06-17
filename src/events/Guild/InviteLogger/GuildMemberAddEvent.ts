import { Collection, GuildMember, TextChannel } from 'discord.js';
import { ExtendClient } from '../../../structures/Client';
import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { InfoEmbed } from '../../../utils/Discord/Embed';

class GuildMemberAdd extends DiscordEvent<'guildMemberAdd'> {
  name: DiscordEventNames = 'guildMemberAdd';

  async run(client: ExtendClient, member: GuildMember) {
    if (!member.guild.members.me.permissions.has('MANAGE_GUILD')) {
      return;
    }

    const logChannel = member.guild.channels.cache.get('917831415826104381') as TextChannel;

    if (!logChannel) {
      return;
    }

    const cachedInvites = client.invites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();

    const usedInvite = newInvites.find((invite) => cachedInvites.get(invite.code) < invite.uses);
    const inviter = client.users.cache.get(usedInvite?.inviter.id);

    if (!inviter) {
      const embed = InfoEmbed(
        `${member.user} присоединился по коду \`${usedInvite.code}\`. Информация о приглашении не найдена`,
      );
      logChannel.send({ embeds: [embed] });
      return;
    }

    const embed = InfoEmbed(`${member.user} присоединился по коду \`${usedInvite.code}\` созданным ${inviter}`);
    embed.setFooter({ text: `Это ${usedInvite.uses} использование этого кода` });
    logChannel.send({ embeds: [embed] });

    const codeUses = new Collection<string, number>();
    newInvites.each((inv) => codeUses.set(inv.code, inv.uses));
    client.invites.set(member.guild.id, codeUses);
  }
}

export default new GuildMemberAdd();
