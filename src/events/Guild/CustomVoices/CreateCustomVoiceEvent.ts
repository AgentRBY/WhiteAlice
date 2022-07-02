import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { MessageActionRow, MessageButton, MessageEmbed, Util, VoiceState } from 'discord.js';
import { Emojis, EmojisLinks } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { VoiceButtons } from '../../../typings/Interactions';

class CreateCustomVoice extends DiscordEvent<'voiceStateUpdate'> {
  name: DiscordEventNames = 'voiceStateUpdate';

  async run(client: ExtendClient, oldState: VoiceState, newState: VoiceState) {
    const baseVoiceChannelId = await client.service.getBaseVoiceChannel(newState.guild.id);

    if (!baseVoiceChannelId || !newState.channel) {
      return;
    }

    if (baseVoiceChannelId !== newState.channelId) {
      return;
    }

    const customVoice = await newState.channel.parent.createChannel(`${newState.member.displayName}`, {
      type: 'GUILD_VOICE',
      reason: `Create a new custom voice channel for ${newState.member.displayName}`,
      permissionOverwrites: [
        {
          id: client.user.id,
          allow: ['MANAGE_CHANNELS', 'CONNECT', 'SPEAK'],
        },
      ],
    });
    newState.setChannel(customVoice, `Create a new custom voice channel for ${newState.member.displayName}`);

    const bitrate = newState.guild.maximumBitrate - 64_000;

    if (bitrate > 64_000) {
      customVoice.setBitrate(bitrate);
    }

    const customChannel = await newState.channel.parent.createChannel(`чат-${newState.member.displayName}`, {
      type: 'GUILD_TEXT',
      reason: `Create a new custom text channel for ${newState.member.displayName}`,
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
          allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
        },
      ],
    });

    const embed = new MessageEmbed().setColor(Colors.Blue).setAuthor({
      name: `Голосовой канал ${newState.member.displayName}`,
      iconURL: EmojisLinks.Headphone,
    }).setDescription(` 
        **Это пользовательский голосовой канал созданный ${Util.escapeMarkdown(newState.member.displayName)}**
        
        ┏ **Доступные команды:**
        ┣ \`>vcName\`  - сменить имя голосового канала
        ┣ \`>vcLock\` - закрыть голосовой канал
        ┣ \`>vcUnlock\` - открыть голосовой канал
        ┣ \`>vcBitrate\` - установить битрейт голосового канала
        ┣ \`>vcKick\` - кикнуть участника из голосового канала
        ┣ \`>vcLimit\` - установить лимит пользователей в голосовом канале
        ┗ \`>vcGame\` - установить канал как игровой
      `);

    const buttons = new MessageActionRow().setComponents(
      new MessageButton()
        .setLabel('Закрыть канал')
        .setCustomId(VoiceButtons.LockVoiceChannel)
        .setStyle('PRIMARY')
        .setEmoji('🔒'),
      new MessageButton()
        .setLabel('Установить максимальный битрейт')
        .setCustomId(VoiceButtons.SetMaxBitrate)
        .setStyle('PRIMARY')
        .setEmoji(Emojis.Music),
      new MessageButton()
        .setLabel('Установить канал как игровой')
        .setCustomId(VoiceButtons.SetGameVoiceChannel)
        .setStyle('PRIMARY')
        .setEmoji(Emojis.Play),
      new MessageButton()
        .setLabel('Кикнуть пользователя из канала')
        .setCustomId(VoiceButtons.KickUserFromVoiceChannel)
        .setStyle('DANGER')
        .setEmoji('🚪'),
    );

    const message = await customChannel.send({ embeds: [embed], components: [buttons] });
    message.pin();

    client.customVoicesState.set(customVoice.id, [newState.member.id, customChannel.id]);
  }
}

export default new CreateCustomVoice();
