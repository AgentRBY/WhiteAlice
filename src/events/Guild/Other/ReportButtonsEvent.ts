import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction, Message } from 'discord.js';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class ReportButton extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  async run(client: ExtendClient, interaction: Interaction) {
    if (!interaction.isButton()) {
      return;
    }

    const customId = interaction.customId;
    if (!customId.startsWith('report')) {
      return;
    }

    const guildId = customId.split('-')[2];

    if (interaction.message instanceof Message) {
      const buttonIndex = interaction.message.components[0].components.findIndex(
        (component) => component.customId === customId,
      );
      const newButton = interaction.message.components[0].components[buttonIndex].setDisabled(true);

      const buttons = interaction.message.components[0].spliceComponents(buttonIndex, 1, newButton);
      const embed = interaction.message.embeds[0];

      interaction.message.edit({ embeds: [embed], components: [buttons] });
    }

    if (customId.startsWith('report-delete')) {
      const messageId = customId.split('-')[3];

      const message = await new Promise<Message>(async (resolve) => {
        await client.guilds.cache.get(guildId).channels.cache.forEach(async (channel) => {
          if (!channel.isText()) {
            return;
          }

          const message = await channel.messages.fetch(messageId).catch(() => {});

          if (message) {
            resolve(message);
            return;
          }
        });
      });

      if (!message) {
        const embed = ErrorEmbed('Сообщение не найдено');
        interaction.reply({ embeds: [embed] });
        return;
      }

      message.delete();

      const embed = SuccessEmbed('Сообщение удалено');
      interaction.reply({ embeds: [embed] });
      return;
    }

    if (customId.startsWith('report-ban')) {
      const userId = customId.split('-')[3];

      const member = await client.guilds.cache.get(guildId).members.cache.get(userId);

      if (!member) {
        const embed = ErrorEmbed('Пользователь не найден');
        interaction.reply({ embeds: [embed] });
        return;
      }

      await member.ban();

      const embed = SuccessEmbed('Пользователь забанен');
      interaction.reply({ embeds: [embed] });
      return;
    }
  }
}

export default new ReportButton();
