import { Service } from '../../structures/Service';
import { MemberBaseId, Warn } from '../../typings/MemberModel';
import { KARMA_FOR_WARN } from '../../static/Punishment';

export class WarnsAction {
  async getWarns(this: Service, id: MemberBaseId): Promise<Warn[]> {
    const MemberData = await this.getMemberData(id);

    return MemberData.warns;
  }

  async addWarn(this: Service, id: MemberBaseId, warn: Warn) {
    const MemberData = await this.getMemberData(id);

    MemberData.warns.push(warn);

    await this.addKarma(id, KARMA_FOR_WARN);
    await this.setMemberData(id, MemberData);
  }

  async removeWarn(this: Service, id: MemberBaseId, warnId: number, removedBy: string, reason?: string) {
    const MemberData = await this.getMemberData(id);

    const warn = MemberData.warns[warnId];

    MemberData.warns[warnId] = {
      date: warn.date,
      givenBy: warn.givenBy,
      reason: warn.reason,
      removed: true,
      removedBy,
      removedDate: Date.now(),
      removedReason: reason,
    };

    await this.removeKarma(id, KARMA_FOR_WARN);
    await this.setMemberData(id, MemberData);
  }

  async calculateWarnsKarma(this: Service, id: MemberBaseId): Promise<number> {
    const MemberData = await this.getMemberData(id);

    return MemberData.warns.filter((warn) => !warn.removed).length * KARMA_FOR_WARN;
  }
}
