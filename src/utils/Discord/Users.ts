import { Guild, GuildMember, MessageMentions, Snowflake } from 'discord.js';

export const getMemberById = (guild: Guild, id: Snowflake): GuildMember => {
  return guild.members.cache.get(id);
};

export const getMemberByUsername = (guild: Guild, username: string): GuildMember => {
  return guild.members.cache.find((member) => member.user.username === username);
};

export const getMemberByMention = (guild: Guild, mention: string): GuildMember => {
  const member = MessageMentions.USERS_PATTERN.exec(mention);
  return getMemberById(guild, member ? member[2] : null);
};

export const getMemberFromLine = (guild: Guild, line: string): GuildMember => {
  return getMemberById(guild, line) || getMemberByUsername(guild, line) || getMemberByMention(guild, line);
};

export const getMemberFromLines = (guild: Guild, lines: string[]): GuildMember | null => {
  let member: GuildMember;

  for (const line of lines) {
    member = getMemberFromLine(guild, line);

    if (member) {
      return member;
    }
  }

  return null;
};

export const getMembersFromLines = (guild: Guild, lines: string[]): GuildMember[] => {
  const members: GuildMember[] = [];

  for (const line of lines) {
    const member = getMemberFromLine(guild, line);

    if (member) {
      members.push(member);
    }
  }

  return members;
};
