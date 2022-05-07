export interface IMemberModel {
  _id: string;
  messageCount: number;
  warns: Warn[];
  mutes: Mute[];
  bans: Ban[];
}

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
