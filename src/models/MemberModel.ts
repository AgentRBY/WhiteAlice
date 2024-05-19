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
  profile: {
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    timeInVoice: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
    customization: {
      color: String,
      background: String,
      frame: String,
    },
    achievements: [
      {
        name: String,
        description: String,
      },
    ],
  },
  karma: {
    type: Number,
    default: 0,
  },
});

export const MemberModel = model<IMemberModel>('MemberData', MemberSchema);
