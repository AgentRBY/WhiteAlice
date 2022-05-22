import { model, Schema } from 'mongoose';
import { IMemberModel } from '../typings/MemberModel';

const MemberSchema = new Schema<IMemberModel>({
  _id: String,
  messageCount: {
    type: Number,
    default: 0,
  },
  warns: [
    {
      date: Number,
      givenBy: String,
      reason: String,
      removed: Boolean,
      removedBy: String,
      removedReason: String,
      removedDate: Number,
    },
  ],
  mutes: [
    {
      date: Number,
      givenBy: String,
      reason: String,
      time: Number,
      unmuted: Boolean,
      unmutedBy: String,
      unmutedReason: String,
      unmutedDate: Number,
    },
  ],
  bans: [
    {
      date: Number,
      givenBy: String,
      reason: String,
      unbanned: Boolean,
      unbannedBy: String,
      unbannedReason: String,
      unbannedDate: Number,
      messageDeleteCountInDays: {
        type: Number,
        default: 0,
      },
    },
  ],
  karma: Number,
});

export const MemberModel = model<IMemberModel>('MemberData', MemberSchema);
