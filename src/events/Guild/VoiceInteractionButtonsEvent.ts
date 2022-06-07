import { Event } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { GuildMember, Interaction, Message, MessageButton, MessageEmbed, TextChannel, VoiceChannel } from 'discord.js';
import { VoiceButtons, VoiceModals, VoiceSelects } from '../../typings/Interactions';
import { includesInEnum } from '../../utils/Other';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { ErrorEmbed } from '../../utils/Discord/Embed';
import { Modal, SelectMenuComponent, showModal } from 'discord-modals';

export default new Event({
  name: 'interactionCreate',
  type: 'discord',
  run: async (client: ExtendClient, interaction: Interaction) => {
    if (!interaction.isButton()) {
      return;
    }

    if (!includesInEnum(interaction.customId, VoiceButtons)) {
      return;
    }

    const voiceChannelId = client.customVoicesState.findKey(([authorId]) => authorId === interaction.user.id);

    if (!voiceChannelId && interaction.customId !== VoiceButtons.MakeMeOwner) {
      const embed = ErrorEmbed('Вы не являетесь автором этого голосового канала');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId) as VoiceChannel;

    switch (interaction.customId) {
      case VoiceButtons.LockVoiceChannel: {
        const isUnlocked = !voiceChannel.permissionsFor(interaction.guild.id).has('CONNECT');

        voiceChannel.permissionOverwrites.edit(interaction.guild.id, {
          CONNECT: isUnlocked,
        });

        if (interaction.message instanceof Message) {
          const newButton = new MessageButton()
            .setLabel(isUnlocked ? 'Закрыть канал' : 'Открыть канал')
            .setCustomId(VoiceButtons.LockVoiceChannel)
            .setStyle('PRIMARY')
            .setEmoji(isUnlocked ? '🔒' : '🔓');

          const buttons = interaction.message.components[0].spliceComponents(0, 1, newButton);
          const embed = interaction.message.embeds[0];

          interaction.message.edit({ embeds: [embed], components: [buttons] });
        }

        const embed = new MessageEmbed()
          .setColor(Colors.Green)
          .setDescription(`${isUnlocked ? '🔓' : '🔒'} Голосовой канал **${isUnlocked ? 'открыт' : 'закрыт'}**`);

        interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }
      case VoiceButtons.SetMaxBitrate: {
        const bitrate = voiceChannel.guild.maximumBitrate;
        voiceChannel.setBitrate(bitrate);

        if (interaction.message instanceof Message) {
          const newButton = new MessageButton()
            .setLabel('Максимальный битрейт установлен')
            .setCustomId(VoiceButtons.SetMaxBitrate)
            .setStyle('PRIMARY')
            .setEmoji(Emojis.Music)
            .setDisabled(true);

          const buttons = interaction.message.components[0].spliceComponents(1, 1, newButton);
          const embed = interaction.message.embeds[0];

          interaction.message.edit({ embeds: [embed], components: [buttons] });
        }

        const embed = new MessageEmbed()
          .setColor(Colors.Green)
          .setDescription(`${Emojis.Music} Битрейт голосового канала установлен на ${bitrate / 1000} Кбит/с`);

        interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }
      case VoiceButtons.SetGameVoiceChannel: {
        if (!(interaction.member instanceof GuildMember)) {
          return;
        }

        const userActivity = interaction.member.presence?.activities[0];

        if (!userActivity) {
          const embed = ErrorEmbed('Вы не находитесь в игре или не слушаете музыку');
          interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        let activityName: string;

        switch (userActivity.type) {
          case 'PLAYING':
            activityName = '🎮 Играем в';
            break;
          case 'LISTENING':
            activityName = '🎧 Слушаем';
            break;
          case 'WATCHING':
            activityName = '💻 Смотрим';
            break;
          case 'STREAMING':
            activityName = '🎥 Стримим';
            break;
          case 'COMPETING':
            activityName = '🔪 Сражаемся в';
            break;
          default:
            activityName = '🎮 Играем в';
            break;
        }

        const channelName = `${activityName} ${userActivity.name}`;
        voiceChannel.setName(channelName);

        const embed = new MessageEmbed()
          .setColor(Colors.Green)
          .setDescription(`${Emojis.Play} Имя канала установлено как \`${channelName}\``);
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }
      case VoiceButtons.KickUserFromVoiceChannel: {
        const members = voiceChannel.members.filter((member) => member.id !== interaction.user.id);

        if (!members.size) {
          const embed = ErrorEmbed('В голосовом канале нет никого кроме вас');
          interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        // TODO: Replace to discord.js Modal
        const userSelect = new SelectMenuComponent()
          .setCustomId(VoiceSelects.KickUserFromVoiceChannel)
          .setPlaceholder('Выберите пользователя')
          .setMinValues(1)
          .addOptions(
            ...members.map((member) => {
              return {
                label: member.user.tag,
                value: member.id,
              };
            }),
          );

        const modal = new Modal()
          .setCustomId(VoiceModals.KickUserFromVoiceChannel)
          .setTitle('Кикнуть пользователя из голосового канала')
          .addComponents(userSelect);

        showModal(modal, {
          client,
          interaction,
        });

        break;
      }
      case VoiceButtons.MakeMeOwner: {
        const textChannel = interaction.channel as TextChannel;
        const voiceChannelId = client.customVoicesState.findKey(([, channelId]) => channelId === textChannel.id);
        const [authorId, textChannelId] = client.customVoicesState.get(voiceChannelId);

        if (authorId) {
          const embed = ErrorEmbed('У канала уже есть владелец');
          interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        const voiceChannel = interaction.guild.channels.cache.get(voiceChannelId) as VoiceChannel;

        textChannel.permissionOverwrites.edit(interaction.user.id, {
          VIEW_CHANNEL: true,
        });

        if (interaction.member instanceof GuildMember) {
          voiceChannel.setName(interaction.member.displayName);
        }

        client.customVoicesState.set(voiceChannelId, [interaction.user.id, textChannelId]);

        if (interaction.message instanceof Message) {
          const newButton = interaction.message.components[0].components[0].setDisabled(true);

          const button = interaction.message.components[0].spliceComponents(0, 1, newButton);
          const embed = interaction.message.embeds[0];

          interaction.message.edit({ embeds: [embed], components: [button] });
        }

        const embed = new MessageEmbed()
          .setColor(Colors.Green)
          .setDescription(`👑 Владельцем канала стал ${interaction.member}`);
        interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }
    }
  },
});
