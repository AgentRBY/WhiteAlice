import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { VoiceState } from 'discord.js';

class DeleteCustomVoice extends DiscordEvent<'voiceStateUpdate'> {
  name: DiscordEventNames = 'voiceStateUpdate';

  async run(client: ExtendClient, oldState: VoiceState, newState: VoiceState) {
    if ((!oldState.streaming && newState.streaming) || (!oldState.selfVideo && newState.selfVideo)) {
      return;
    }

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
  }
}

export default new DeleteCustomVoice();
