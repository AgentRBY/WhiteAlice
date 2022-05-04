export interface IMemberModel {
  _id: string;
  warns: Warn[];
  messageCount: number;
  mutes: Mute[];
}

export type Warn = Punishment;

export interface Mute extends Punishment {
  time: number;
  unmuted?: boolean;
}

export interface Punishment {
  date: number;
  givenBy: string;
  reason?: string;
}
