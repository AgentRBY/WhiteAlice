import { Service } from '../../structures/Service';
import { MemberBaseId } from '../../typings/MemberModel';

export class ProfileAction {
  async incrementMessageCount(this: Service, id: MemberBaseId) {
    console.log('test', this);
    const MemberData = await this.getMemberData(id);

    MemberData.messageCount++;
  }
}
