import { Service } from '../../structures/Service';
import { MemberBaseId } from '../../typings/MemberModel';

export class ProfileAction {
  async incrementMessageCount(this: Service, id: MemberBaseId): Promise<void> {
    const MemberData = await this.getMemberData(id);

    MemberData.messageCount++;
    this.setMemberData(id, MemberData);
  }
}
