import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Interaction } from 'discord.js';
import { ReportStatus } from '../../../typings/GuildModel';
import { Emojis } from '../../../static/Emojis';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { ReportsCommand } from '../../../commands/Slash/Testing/ReportsCommand';

class ReportButton extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  async run(client: ExtendClient, interaction: Interaction) {
    if (!interaction.isSelectMenu()) {
      return;
    }

    if (!interaction.customId.startsWith('report-status-select')) {
      return;
    }

    if (!interaction.memberPermissions.has('ADMINISTRATOR')) {
      const embed = ErrorEmbed('Недостаточно прав');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const reportId = Number(interaction.customId.split('-')[3]);

    const status = interaction.values[0];

    const newReport = await client.service.changeReportStatus(
      interaction.guildId,
      reportId,
      status as ReportStatus,
      interaction.user.id,
    );

    const statusToString = {
      [ReportStatus.New]: `${Emojis.Add} Новый`,
      [ReportStatus.Declined]: `${Emojis.No} Отклонён`,
      [ReportStatus.InProgress]: `${Emojis.Wrench} В процессе`,
      [ReportStatus.Done]: `${Emojis.Yes} Сделан`,
    };

    await interaction.channel.messages
      .fetch(interaction.message.id)
      .then((message) => {
        const embed = ReportsCommand.buildReportEmbed(newReport);
        const select = ReportsCommand.buildReportStatusSelect(newReport);

        message.edit({ embeds: [embed], components: [select] }).catch(() => {});
      })
      .catch(() => {});

    const successEmbed = SuccessEmbed(`Статус репорта №${reportId} изменён на ${statusToString[status]}`);

    await interaction.reply({
      embeds: [successEmbed],
      ephemeral: true,
    });
  }
}

export default new ReportButton();
