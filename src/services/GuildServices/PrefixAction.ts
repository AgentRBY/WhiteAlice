import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class PrefixAction {
  async getPrefix(this: Service, id: Snowflake): Promise<string> {
    const GuildData = await this.getGuildData(id);

    return GuildData.prefix;
  }

  async setPrefix(this: Service, id: Snowflake, prefix: string): Promise<void> {
    const GuildData = await this.getGuildData(id);

    if (GuildData.prefix !== prefix) {
      GuildData.prefix = prefix;
      this.client.guildBase.update(id, GuildData);
    }
  }
}
