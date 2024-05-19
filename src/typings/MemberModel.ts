import { Snowflake } from 'discord.js';

export interface IMemberModel {
  _id: MemberBaseId;
  messageCount: number;
  warns: Warn[];
  mutes: Mute[];
  bans: Ban[];
  profile: UserProfile;
  karma: number;
}

export type MemberBaseId = `${Snowflake}-${Snowflake}`;

export interface Warn extends Punishment {
  removed?: boolean;
  removedBy?: string;
  removedDate?: number;
  removedReason?: string;
}

export interface Mute extends Punishment {
  time: number;
  unmuted?: boolean;
  unmutedBy?: string;
  unmutedDate?: number;
  unmutedReason?: string;
}

export interface Ban extends Punishment {
  unbanned?: boolean;
  unbannedBy?: string;
  unbannedDate?: number;
  unbannedReason?: string;
  messageDeleteCountInDays?: number;
}

export interface Punishment {
  date: number;
  givenBy: string;
  reason?: string;
}

export interface UserProfile {
  xp: number;
  level: number;
  messageCount: number;
  timeInVoice: number;
  coins: number;
  customization: Customization;
  achievements: Achievement[];
}

interface Customization {
  color: string;
  background: string;
  frame: string;
}

interface Achievement {
  name: string;
  description: string;
}
