import { model, Schema } from 'mongoose';
import { IGuildModel } from '../typings/GuildModel';

const GuildSchema = new Schema<IGuildModel>({
  _id: String,
  prefix: { type: String, max: 3 },
  notes: [
    {
      name: String,
      content: String,
      createdAt: Number,
      createdBy: String,
    },
  ],
  mediaChannels: [String],
  customVoices: {
    baseVoiceChannel: String,
  },
});

export const GuildModel = model<IGuildModel>('GuildData', GuildSchema);
