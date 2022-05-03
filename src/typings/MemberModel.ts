export interface IMemberModel {
  _id: string;
  warns: Warn[];
  messageCount: number;
}

export interface Warn {
  date: number;
  givenBy: string;
  reason?: string;
}
