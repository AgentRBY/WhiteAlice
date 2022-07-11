import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class MediaChannelsAction {
  async getMediaChannels(this: Service, id: Snowflake): Promise<string[]> {
    const GuildData = await this.getGuildData(id);

    return GuildData.mediaChannels;
  }

  async isMediaChannel(this: Service, id: Snowflake, channelID: string): Promise<boolean> {
    const GuildData = await this.getGuildData(id);

    return GuildData.mediaChannels.includes(channelID);
  }

  async setMediaChannel(this: Service, id: Snowflake, channelID: string): Promise<void> {
    this.updateGuildData(id, { $push: { mediaChannels: channelID } });
  }

  async removeMediaChannel(this: Service, id: Snowflake, channelID: string): Promise<void> {
    const GuildData = await this.getGuildData(id);

    const channels = GuildData.mediaChannels.filter((channel) => channel !== channelID);
    this.updateGuildData(id, { mediaChannels: channels });
  }
}
