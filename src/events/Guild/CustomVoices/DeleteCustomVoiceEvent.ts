import { Event } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { VoiceState } from 'discord.js';

export default new Event({
  name: 'voiceStateUpdate',
  type: 'discord',
  run: async (client: ExtendClient, oldState: VoiceState, newState: VoiceState) => {
    const baseVoiceChannelId = await client.service.getBaseVoiceChannel(newState.guild.id);

    if (!baseVoiceChannelId || !oldState.channel) {
      return;
    }

    if (!client.customVoicesState.has(oldState.channelId)) {
      return;
    }

    if (oldState.channel.members.size > 0) {
      return;
    }

    const customTextChannelId = client.customVoicesState.get(oldState.channelId)[1];
    const customTextChannel = await oldState.guild.channels.cache.get(customTextChannelId);

    client.customVoicesState.delete(oldState.channelId);
    customTextChannel.delete('Delete custom text channel');
    await oldState.channel.delete('Delete custom voice channel');
  },
});
