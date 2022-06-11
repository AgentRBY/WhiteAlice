import { Event } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { DMChannel, GuildChannel } from 'discord.js';

export default new Event({
  name: 'channelDelete',
  type: 'discord',
  run: async (client: ExtendClient, channel: DMChannel | GuildChannel) => {
    if (channel instanceof DMChannel) {
      return;
    }

    if (channel.type !== 'GUILD_VOICE') {
      return;
    }

    const baseVoiceChannelId = await client.service.getBaseVoiceChannel(channel.guild.id);

    if (!baseVoiceChannelId) {
      return;
    }

    if (channel.id !== baseVoiceChannelId) {
      return;
    }

    await client.service.removeBaseVoiceChannel(channel.guild.id);
  },
});
