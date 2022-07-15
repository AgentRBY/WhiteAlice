import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { MessageActionRow, MessageButton, MessageEmbed, TextChannel, VoiceState } from 'discord.js';
import { EmojisLinks } from '../../../static/Emojis';
import { VoiceButtons } from '../../../typings/Interactions';
import { Colors } from '../../../static/Colors';

class CustomVoiceAuthorLeave extends DiscordEvent<'voiceStateUpdate'> {
  name: DiscordEventNames = 'voiceStateUpdate';

  async run(client: ExtendClient, oldState: VoiceState, newState: VoiceState) {
    if (oldState.streaming !== newState.streaming) {
      return;
    }

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

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setAuthor({
        name: `Голосовой канал ${oldState.member.displayName}`,
        iconURL: EmojisLinks.Headphone,
      })
      .setDescription('Автор голосового канала вышел. Место владельца свободно');

    const button = new MessageActionRow().setComponents(
      new MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Стать владельцем голосового канала')
        .setCustomId(VoiceButtons.MakeMeOwner),
    );

    const textChannelId = client.customVoicesState.get(oldState.channelId)[1];

    const channel = (await newState.guild.channels.cache.get(textChannelId)) as TextChannel;
    channel.send({ embeds: [embed], components: [button] });

    client.customVoicesState.set(oldState.channel.id, [null, textChannelId]);
  }
}

export default new CustomVoiceAuthorLeave();
