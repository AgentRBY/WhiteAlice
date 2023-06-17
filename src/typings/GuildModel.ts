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
