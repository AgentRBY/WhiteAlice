import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class ModeratorsAction {
  async getModerators(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.moderators;
  }

  async addModerator(this: Service, id: Snowflake, moderator: Snowflake) {
    await this.updateGuildData(id, { $push: { moderators: moderator } });
  }

  async removeModerator(this: Service, id: Snowflake, moderator: Snowflake) {
    const GuildData = await this.getGuildData(id);

    const moderators = GuildData.moderators.filter((moderatorId) => moderator != moderatorId);
    await this.updateGuildData(id, { moderators });
  }

  async isModeratorExist(this: Service, id: Snowflake, moderator: Snowflake) {
    const moderators = await this.getModerators(id);

    return moderators.includes(moderator);
  }
}
