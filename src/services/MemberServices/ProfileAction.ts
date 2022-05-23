import { Service } from '../../structures/Service';
import { MemberBaseId } from '../../typings/MemberModel';

export class ProfileAction {
  async incrementMessageCount(this: Service, id: MemberBaseId) {
    const MemberData = await this.getMemberData(id);

    await MemberData.updateOne({ messageCount: MemberData.messageCount + 1 });
  }
}
