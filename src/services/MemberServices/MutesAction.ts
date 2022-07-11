import { Service } from '../../structures/Service';
import { IMemberModel, MemberBaseId, Mute } from '../../typings/MemberModel';
import { KARMA_FOR_BAN, KARMA_FOR_MUTE, KARMA_FOR_WARN } from '../../static/Punishment';
import { MemberModel } from '../../models/MemberModel';
import { Snowflake } from 'discord.js';
import { MongoData } from '../../typings/Database';
import { PipelineStage } from 'mongoose';

export class MutesAction {
  async getMutes(this: Service, id: MemberBaseId): Promise<Mute[]> {
    const MemberData = await this.getMemberData(id);

    return MemberData.mutes;
  }

  async addMute(this: Service, id: MemberBaseId, mute: Mute): Promise<void> {
    await this.updateMemberData(id, { $push: { mutes: mute } });
    await this.addKarma(id, KARMA_FOR_MUTE);
  }

  async removeMute(this: Service, id: MemberBaseId, unmutedBy: string, reason?: string): Promise<void> {
    const MemberData = await this.getMemberData(id);

    const mute = MemberData.mutes[MemberData.mutes.length - 1];

    MemberData.mutes[MemberData.mutes.length - 1] = {
      date: mute.date,
      givenBy: mute.givenBy,
      time: mute.time,
      reason: mute.reason,
      unmuted: true,
      unmutedDate: Date.now(),
      unmutedBy,
      unmutedReason: reason,
    };

    await this.updateMemberData(id, { mutes: MemberData.mutes });
    await this.removeKarma(id, KARMA_FOR_MUTE);
  }

  async calculateMuteTime(this: Service, id: MemberBaseId, time: number): Promise<number> {
    const karma = (await this.getKarma(id)) || 0;

    return time * (karma / 100 + 1);
  }

  async getKarma(this: Service, id: MemberBaseId): Promise<number> {
    const MemberData = await this.getMemberData(id);

    return MemberData.karma;
  }

  async addKarma(this: Service, id: MemberBaseId, amount: number): Promise<void> {
    await this.updateMemberData(id, { $inc: { karma: amount } });
  }

  async removeKarma(this: Service, id: MemberBaseId, amount: number): Promise<void> {
    const MemberData = await this.getMemberData(id);

    const karma = MemberData.karma - amount;
    await this.updateMemberData(id, { karma });
  }

  async recalculateKarma(this: Service, id: MemberBaseId): Promise<void> {
    const MemberData = await this.getMemberData(id);

    const warns = MemberData.warns.filter((warn) => !warn.removed);
    const mutes = MemberData.mutes.filter((mute) => !mute.unmuted);
    const bans = MemberData.bans;

    const karmaForWarns = warns.length * KARMA_FOR_WARN;
    const karmaForMutes = mutes.length * KARMA_FOR_MUTE;
    const karmaForBans = bans.length * KARMA_FOR_BAN;

    const karma = karmaForWarns + karmaForMutes + karmaForBans;

    await this.updateMemberData(id, { karma });
  }

  async calculateMutesKarma(this: Service, id: MemberBaseId): Promise<number> {
    const MemberData = await this.getMemberData(id);

    return MemberData.mutes.filter((mute) => !mute.unmuted).length * KARMA_FOR_MUTE;
  }

  async getCurrentMutes(this: Service, guildId: Snowflake): Promise<MongoData<IMemberModel>[]> {
    const filterMutesByTimeAndUnMuted: PipelineStage = {
      $set: {
        mutes: {
          $filter: {
            input: '$mutes',
            as: 'mute',
            cond: {
              $and: [
                {
                  $gte: [
                    {
                      $add: ['$$mute.time', '$$mute.date'],
                    },
                    Date.now(),
                  ],
                },
                {
                  $not: '$$mute.unmuted',
                },
              ],
            },
          },
        },
      },
    };

    const addMutesSizeField: PipelineStage = {
      $addFields: {
        mutesSize: {
          $size: '$mutes',
        },
      },
    };

    const sortByMutedSizeAndGuildId: PipelineStage = {
      $match: {
        _id: new RegExp(`\\d+-${guildId}`),
        mutesSize: {
          $ne: 0,
        },
      },
    };

    return MemberModel.aggregate([filterMutesByTimeAndUnMuted, addMutesSizeField, sortByMutedSizeAndGuildId]);
  }
}
