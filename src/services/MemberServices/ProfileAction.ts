import { Service } from '../../structures/Service';
import { MemberBaseId } from '../../typings/MemberModel';
import { getRandomInt } from '../../utils/Common/Number';

export class ProfileAction {
  async incrementMessageCount(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    this.updateMemberData(id, { 'profile.messageCount': MemberData.profile.messageCount + 1 });
  }

  async getCurrentLevel(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    return MemberData.profile.level;
  }

  async getCurrentXp(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    return MemberData.profile.xp;
  }

  async incrementXp(this: Service, id: MemberBaseId, xpToAdd: number) {
    const MemberData = await this.getMemberData(id);

    this.updateMemberData(id, { 'profile.xp': MemberData.profile.xp + xpToAdd });
  }

  getXpByLevel(this: Service, level: number) {
    return (5 / 6) * level * (2 * level * level + 27 * level + 91); // XP FORMULA
  }

  async incrementLevel(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    const memberLevel = MemberData.profile.level;
    const memberXp = MemberData.profile.xp;

    const nextLevelXp = this.getXpByLevel(memberLevel + 1);

    await this.updateMemberData(id, {
      'profile.level': MemberData.profile.level + 1,
      'profile.xp': memberXp - nextLevelXp,
    });
  }

  async recalculateLevel(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    let level = MemberData.profile.level + 1;
    let xp = MemberData.profile.xp;
    let nextLevelXp = this.getXpByLevel(level);

    while (xp > nextLevelXp) {
      xp -= nextLevelXp;
      level += 1;
      nextLevelXp = this.getXpByLevel(level);
    }

    await this.updateMemberData(id, {
      'profile.level': level,
      'profile.xp': xp,
    });
  }

  async migrateLevel(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    const messageCount = MemberData.messageCount;

    if (messageCount === 0) {
      return;
    }

    const xp = getRandomInt(10, 25) * messageCount + MemberData.profile.xp;

    const newMessageCount = messageCount + MemberData.profile.messageCount;
    await this.updateMemberData(id, {
      'profile.xp': xp,
      'profile.messageCount': newMessageCount,
      messageCount: 0,
    });
    await this.recalculateLevel(id);
  }
}
