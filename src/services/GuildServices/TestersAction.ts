import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class TestersAction {
  async getTesters(this: Service, id: Snowflake): Promise<string[]> {
    const GuildData = await this.getGuildData(id);

    return GuildData.testersID;
  }

  async isTester(this: Service, id: Snowflake, userID: Snowflake): Promise<boolean> {
    const testers = await this.getTesters(id);

    return testers.includes(userID);
  }
}
