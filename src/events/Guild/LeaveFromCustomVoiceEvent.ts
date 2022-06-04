import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { TextChannel, VoiceState } from 'discord.js';

export default new Event({
  name: 'voiceStateUpdate',
  type: 'discord',
  run: async (client: ExtendClient, oldState: VoiceState, newState: VoiceState) => {
    const baseVoiceChannelId = await client.service.getBaseVoiceChannel(newState.guild.id);

    if (!baseVoiceChannelId || !oldState.channel || oldState.member.id === client.user.id) {
      return;
    }

    if (!client.customVoicesState.has(oldState.channelId)) {
      return;
    }

    if (oldState.channel.members.size === 0) {
      return;
    }

    const customTextChannelId = client.customVoicesState.get(oldState.channelId)[1];
    const customTextChannel = (await oldState.guild.channels.cache.get(customTextChannelId)) as TextChannel;

    customTextChannel.permissionOverwrites.create(oldState.member.id, {
      VIEW_CHANNEL: false,
    });
  },
});
