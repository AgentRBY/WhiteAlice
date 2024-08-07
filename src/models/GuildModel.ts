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
  moderators: [String],
  quotes: [
    {
      author: String,
      createdAt: Number,
      content: String,
    },
  ],
  testing: {
    reportsChannel: String,
    reports: [
      {
        id: Number,
        authorId: String,
        description: String,
        links: String,
        status: String,
        createdAt: Number,
        editedAt: Number,
        editedBy: String,
      },
    ],
  },
  autoAnswers: [
    {
      id: Number,
      triggerRegex: String,
      answer: String,
    },
  ],
});

export const GuildModel = model<IGuildModel>('GuildData', GuildSchema);
