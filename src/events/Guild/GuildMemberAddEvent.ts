import {Event} from '../../structures/Event';
import {ExtendClient} from '../../structures/Client';
import {GuildMember, TextChannel} from 'discord.js';
import {InfoEmbed} from '../../utils/Embed';

export default new Event({
  name: 'guildMemberAdd',
  run: (client: ExtendClient, member: GuildMember) => {
    if (!member.guild.me.permissions.has('MANAGE_GUILD')) {
      return;
    }

    member.guild.invites.fetch().then((newInvites) => {
      const oldInvites = client.invites.get(member.guild.id);
      const invite = newInvites.find((index) => oldInvites.has(index.code));
      const inviter = client.users.cache.get(invite.inviter.id);
      const logChannel = member.guild.channels.cache.get('917831415826104381') as TextChannel;

      if (inviter) {
        const embed = InfoEmbed(
          `${member.user} присоединился по коду \`${invite.code}\` созданным ${inviter}. 
          Это ${invite.uses} использование этого кода`,
        );
        logChannel.send({ embeds: [embed] });
        return;
      }

      const embed = InfoEmbed(`${member.user} присоединился. Информация о приглашении не найдена`);
      logChannel.send({ embeds: [embed] });
      return;
    });
  },
});
