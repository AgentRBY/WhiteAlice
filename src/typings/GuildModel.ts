import { Snowflake } from 'discord.js';

export interface IGuildModel {
  _id: Snowflake;
  prefix: string;
  testersID: string[];
  notes: Note[];
  mediaChannels: string[];
  customVoices: CustomVoice;
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
