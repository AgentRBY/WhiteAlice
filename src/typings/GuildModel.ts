import { Snowflake } from 'discord.js';

export interface IGuildModel {
  _id: Snowflake;
  prefix: string;
  testersID: string[];
  notes: Note[];
  mediaChannels: string[];
  customVoices: CustomVoice;
  moderators: string[];
  quotes: Quote[];
  testing: Testing;
  autoAnswers: AutoAnswer[];
}

interface Quote {
  content: string;
  author: string;
  createdAt: number;
}

export interface Note {
  name: string;
  content: string;
  createdAt: number;
  createdBy: string;
}

export interface CustomVoice {
  baseVoiceChannel: string;
}

export interface Testing {
  reportsChannel: string;
  reports: Report[];
}
export enum ReportStatus {
  New = 'New',
  InProgress = 'InProgress',
  Declined = 'Declined',
  Done = 'Done',
}

export interface Report {
  id: number;
  authorId: string;
  description: string;
  links?: string;
  status: ReportStatus;
  createdAt: number;
  editedAt?: number;
  editedBy?: string;
}

export interface AutoAnswer {
  id: number;
  triggerRegex: string;
  answer: string;
}
