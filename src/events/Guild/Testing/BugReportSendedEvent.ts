import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction, TextChannel } from 'discord.js';
import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { ReportsCommand } from '../../../commands/Slash/Testing/ReportsCommand';

class BugReportSendedEvent extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  async run(client: ExtendClient, interaction: Interaction) {
    if (!interaction.isModalSubmit()) {
      return;
    }

    if (interaction.customId !== 'report-modal') {
      return;
    }

    const reportChannelsId = await client.service.getReportsChannel(interaction.guildId);
    const reportChannels = interaction.guild.channels.cache.get(reportChannelsId) as TextChannel;

    const description = interaction.fields.getTextInputValue('report-modal-description');
    const links = interaction.fields.getTextInputValue('report-modal-links');

    const newReport = await client.service.addReport(interaction.guildId, {
      description,
      links,
      authorId: interaction.user.id,
    });

    const embed = ReportsCommand.buildReportEmbed(newReport);
    const select = ReportsCommand.buildReportStatusSelect(newReport);

    reportChannels.send({ embeds: [embed], components: [select] });

    const successEmbed = SuccessEmbed('Ваш репорт был отправлен');

    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
  }
}

export default new BugReportSendedEvent();
