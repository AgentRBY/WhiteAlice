import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { DMChannel, GuildChannel } from 'discord.js';

class DeleteBasicVoiceChannel extends DiscordEvent<'channelDelete'> {
  name: DiscordEventNames = 'channelDelete';

  async run(client: ExtendClient, channel: DMChannel | GuildChannel) {
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
  }
}

export default new DeleteBasicVoiceChannel();
