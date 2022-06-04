import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class CustomVoiceAction {
  async getBaseVoiceChannel(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.customVoices.baseVoiceChannel;
  }

  async setBaseVoiceChannel(this: Service, id: Snowflake, channelId: Snowflake) {
    const GuildData = await this.getGuildData(id);

    GuildData.customVoices.baseVoiceChannel = channelId;
    await GuildData.save();
  }

  async isBaseVoiceChannel(this: Service, id: Snowflake, channelId: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.customVoices.baseVoiceChannel === channelId;
  }

  async removeBaseVoiceChannel(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    GuildData.customVoices.baseVoiceChannel = '';
    await GuildData.save();
  }
}
