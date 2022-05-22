import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class MediaChannelsAction {
  async getMediaChannels(this: Service, id: Snowflake): Promise<string[]> {
    const GuildData = await this.getGuildData(id);

    return GuildData.mediaChannels;
  }

  async isMediaChannel(this: Service, id: Snowflake, channelID: string): Promise<boolean> {
    const GuildData = await this.getGuildData(id);

    console.log(channelID);
    return GuildData.mediaChannels.includes(channelID);
  }

  async addMediaChannel(this: Service, id: Snowflake, channelID: string): Promise<void> {
    const GuildData = await this.getGuildData(id);

    GuildData.mediaChannels.push(channelID);
    this.setGuildData(id, GuildData);
  }

  async removeMediaChannel(this: Service, id: Snowflake, channelID: string): Promise<void> {
    const GuildData = await this.getGuildData(id);

    GuildData.mediaChannels = GuildData.mediaChannels.filter((channel) => channel !== channelID);
    this.setGuildData(id, GuildData);
  }
}
