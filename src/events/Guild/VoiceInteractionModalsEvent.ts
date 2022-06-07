import { VoiceModals, VoiceSelects } from '../../typings/Interactions';
import { ModalSubmitInteraction } from 'discord-modals';
import { ExtendClient } from '../../structures/Client';
import { Event } from '../../structures/Event';
import { includesInEnum } from '../../utils/Other';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';

// TODO: replace to discord.js Modals
export default new Event({
  // @ts-ignore
  name: 'modalSubmit',
  type: 'discord',
  run: async (client: ExtendClient, interaction: ModalSubmitInteraction) => {
    if (!includesInEnum(interaction.customId, VoiceModals)) {
      return;
    }

    const voiceChannelId = client.customVoicesState.findKey(([authorId]) => authorId === interaction.user.id);

    if (!voiceChannelId) {
      const embed = ErrorEmbed('Вы не являетесь автором этого голосового канала');
      interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true });
      return;
    }

    const membersId = interaction.getSelectMenuValues(VoiceSelects.KickUserFromVoiceChannel);
    const members = membersId.map((id) => interaction.guild.members.cache.get(id));

    for (const member of members) {
      member.voice.disconnect(`Kicked from custom voice by ${interaction.member.displayName}`);
    }

    const embed = SuccessEmbed(
      `${
        membersId.length === 1 ? `Пользователь ${members[0]} кикнут` : `Пользователи ${members.join(', ')} кикнуты`
      } из голосового канала`,
    );
    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true });
  },
});
