import { Event } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { TextChannel, VoiceState } from 'discord.js';

export default new Event({
  name: 'voiceStateUpdate',
  type: 'discord',
  run: async (client: ExtendClient, oldState: VoiceState, newState: VoiceState) => {
    const baseVoiceChannelId = await client.service.getBaseVoiceChannel(newState.guild.id);

    if (!baseVoiceChannelId || !newState.channel || newState.member.id === client.user.id) {
      return;
    }

    if (!client.customVoicesState.has(newState.channelId)) {
      return;
    }

    const customTextChannelId = client.customVoicesState.get(newState.channelId)[1];
    const customTextChannel = (await newState.guild.channels.cache.get(customTextChannelId)) as TextChannel;

    customTextChannel.permissionOverwrites.create(newState.member.id, {
      VIEW_CHANNEL: true,
    });
  },
});
