import { Message } from 'discord.js';
import moment from 'moment';
import { ExtendClient } from '../structures/Client';

export function AntiPingModule(client: ExtendClient, message: Message) {
  const mentions = message.mentions.members;

  if (mentions.size < 10) {
    return;
  }

  const member = message.member;

  if (
    member.permissions.has('MODERATE_MEMBERS') ||
    member.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) >= 0
  ) {
    return;
  }

  member.timeout(moment.duration(1, 'hour').asMilliseconds(), 'Флуд упоминаниями');
}
