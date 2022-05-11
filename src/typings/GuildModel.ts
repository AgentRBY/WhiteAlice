export interface IGuildModel {
  _id: string;
  prefix: string;
  testersID: string[];
  notes: Note[];
}

export interface Note {
  name: string;
  content: string;
  createdAt: number;
  createdBy: string;
}
