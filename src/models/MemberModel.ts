import { model, Schema } from 'mongoose';
import { IMemberModel } from '../typings/MemberModel';

const MemberSchema = new Schema<IMemberModel>({
  _id: String,
  warns: [
    {
      date: Number,
      givenBy: String,
      reason: {
        type: String,
        required: false,
      },
    },
  ],
  messageCount: {
    type: Number,
    default: 0,
  },
  mutes: [
    {
      date: Number,
      givenBy: String,
      reason: {
        type: String,
        required: false,
      },
      time: Number,
      unmuted: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
  ],
});

export const MemberModel = model<IMemberModel>('MemberData', MemberSchema);
