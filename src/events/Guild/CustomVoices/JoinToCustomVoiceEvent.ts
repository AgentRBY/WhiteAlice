import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { TextChannel, VoiceState } from 'discord.js';

class JoinToCustomVoice extends DiscordEvent<'voiceStateUpdate'> {
  name: DiscordEventNames = 'voiceStateUpdate';

  async run(client: ExtendClient, oldState: VoiceState, newState: VoiceState) {
    if (oldState.streaming !== newState.streaming) {
      return;
    }

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
  }
}

export default new JoinToCustomVoice();
