export interface IGuildModel {
  _id: string;
  prefix: string;
  testersID: string[];
  notes: Note[];
  mediaChannels: string[];
}

export interface Note {
  name: string;
  content: string;
  createdAt: number;
  createdBy: string;
}
