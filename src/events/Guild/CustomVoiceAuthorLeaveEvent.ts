import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
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

    if (oldState.channel.members.size === 0) {
      return;
    }

    const voiceAuthor = client.customVoicesState.get(oldState.channelId)[0];

    if (voiceAuthor !== oldState.member.id) {
      return;
    }

    const textChannelId = client.customVoicesState.get(oldState.channelId)[1];

    client.customVoicesState.set(oldState.channel.id, [null, textChannelId]);
  },
});
