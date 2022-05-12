import { model, Schema } from 'mongoose';
import { IGuildModel } from '../typings/GuildModel';

const GuildSchema = new Schema<IGuildModel>({
  _id: String,
  prefix: { type: String, max: 3 },
  testersID: [String],
  notes: [
    {
      name: String,
      content: String,
      createdAt: Number,
      createdBy: String,
    },
  ],
  mediaChannels: [String],
});

export const GuildModel = model<IGuildModel>('GuildData', GuildSchema);
