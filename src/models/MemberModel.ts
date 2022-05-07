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
      reason: {
        type: String,
        required: false,
      },
      removed: {
        type: Boolean,
        required: false,
      },
      removedBy: {
        type: String,
        required: false,
      },
      removedReason: {
        type: String,
        required: false,
      },
      removedDate: {
        type: Number,
        required: false,
      },
    },
  ],
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
        required: false,
      },
      unmutedBy: {
        type: String,
        required: false,
      },
      unmutedReason: {
        type: String,
        required: false,
      },
      unmutedDate: {
        type: Number,
        required: false,
      },
    },
  ],
  bans: [
    {
      date: Number,
      givenBy: String,
      reason: {
        type: String,
        required: false,
      },
      unbanned: {
        type: Boolean,
        default: false,
        required: false,
      },
      unbannedBy: {
        type: String,
        required: false,
      },
      unbannedReason: {
        type: String,
        required: false,
      },
      unbannedDate: {
        type: Number,
        required: false,
      },
      messageDeleteCountInDays: {
        type: Number,
        default: 0,
        required: false,
      },
    },
  ],
});

export const MemberModel = model<IMemberModel>('MemberData', MemberSchema);
