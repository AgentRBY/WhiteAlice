import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { VoiceState } from 'discord.js';

export default new Event({
  name: 'voiceStateUpdate',
  type: 'discord',
  run: async (client: ExtendClient, oldState: VoiceState, newState: VoiceState) => {
    const baseVoiceChannelId = await client.service.getBaseVoiceChannel(newState.guild.id);

    if (!baseVoiceChannelId || !newState.channel) {
      return;
    }

    if (baseVoiceChannelId !== newState.channelId) {
      return;
    }

    const customVoice = await newState.channel.parent.createChannel(`${newState.member.displayName}`, {
      type: 'GUILD_VOICE',
      reason: `Create new custom voice channel for ${newState.member.displayName}`,
    });
    newState.setChannel(customVoice, `Create new custom voice channel for ${newState.member.displayName}`);

    const customChannel = await newState.channel.parent.createChannel(`чат-${newState.member.displayName}`, {
      type: 'GUILD_TEXT',
      reason: `Create new custom text channel for ${newState.member.displayName}`,
      permissionOverwrites: [
        {
          id: newState.guild.id, // everyone
          deny: 'VIEW_CHANNEL',
        },
        {
          id: newState.member.id,
          allow: 'VIEW_CHANNEL',
        },
        {
          id: client.user.id,
          allow: 'VIEW_CHANNEL',
        },
      ],
    });

    client.customVoicesState.set(customVoice.id, [newState.member.id, customChannel.id]);
  },
});
