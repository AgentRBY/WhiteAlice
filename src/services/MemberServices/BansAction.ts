import { Service } from '../../structures/Service';
import { Ban, MemberBaseId } from '../../typings/MemberModel';
import { KARMA_FOR_BAN } from '../../static/Punishment';

export class BansAction {
  async getBans(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    return MemberData.bans;
  }

  async addBan(this: Service, id: MemberBaseId, ban: Ban) {
    this.updateGuildData(id, { $push: { bans: ban } });
  }

  async removeBan(this: Service, id: MemberBaseId, unbannedBy: string, reason?: string) {
    const MemberData = await this.getMemberData(id);

    const ban = MemberData.bans.at(-1);

    MemberData.bans[MemberData.bans.length - 1] = {
      date: ban.date,
      reason: ban.reason,
      givenBy: ban.givenBy,
      messageDeleteCountInDays: ban.messageDeleteCountInDays,
      unbanned: true,
      unbannedBy,
      unbannedDate: Date.now(),
      unbannedReason: reason,
    };

    await this.removeKarma(id, KARMA_FOR_BAN);
    await this.updateMemberData(id, { bans: MemberData.bans });
  }

  async calculateBansKarma(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    return MemberData.bans.length * KARMA_FOR_BAN;
  }
}
