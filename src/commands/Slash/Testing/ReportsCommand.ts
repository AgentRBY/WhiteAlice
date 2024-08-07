import {
  AutocompleteRunOptions,
  SlashCommand,
  SlashCommandRunOptions,
} from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent, Util } from 'discord.js';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { Searcher } from 'fast-fuzzy';
import { Emojis, EmojisIDs } from '../../../static/Emojis';
import dayjs from 'dayjs';
import { Colors } from '../../../static/Colors';
import { Report, ReportStatus } from '../../../typings/GuildModel';
import { client } from '../../../app';

export class ReportsCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('report')
    .setDescription('Взаимодействие с репортами')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('channel')
        .setDescription('Установить канал для репортов')
        .addChannelOption((option) =>
          option.setName('channel').setDescription('Канал, в который будут отправлятся репорты').setRequired(true),
        ),
    )
    .addSubcommand((subcommand) => subcommand.setName('bug').setDescription('Отправить баг-репорт'))
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription('Получить информацию о баг-репорте')
        .addStringOption((option) =>
          option.setName('status').setDescription('Статус репорта').setRequired(true).addChoices(
            {
              name: 'Все',
              value: 'Anything',
            },
            {
              name: 'Новый',
              value: ReportStatus.New,
            },
            {
              name: 'В процессе',
              value: ReportStatus.InProgress,
            },
            {
              name: 'Отклонён',
              value: ReportStatus.Declined,
            },
            {
              name: 'Сделан',
              value: ReportStatus.Done,
            },
          ),
        )
        .addNumberOption((option) =>
          option.setName('id').setDescription('ID репорта').setAutocomplete(true).setRequired(true),
        ),
    )
    .addSubcommand((subcommand) => subcommand.setName('statistics').setDescription('Статистика по репортам'));

  public static statusToString = {
    [ReportStatus.New]: `${Emojis.Add} Новый`,
    [ReportStatus.Declined]: `${Emojis.No} Отклонён`,
    [ReportStatus.InProgress]: `${Emojis.Wrench} В процессе`,
    [ReportStatus.Done]: `${Emojis.Yes} Сделан`,
  };

  async run({ interaction, client }: SlashCommandRunOptions) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'channel') {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        const embed = ErrorEmbed('Недостаточно прав');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const channel = interaction.options.getChannel('channel', true);

      client.service.setReportsChannel(interaction.guildId, channel.id);

      const embed = SuccessEmbed(`Добавлен новый канал для репортов: ${channel}`);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (subcommand === 'bug') {
      const reportsChannelId = await client.service.getReportsChannel(interaction.guildId);

      if (!reportsChannelId) {
        const embed = ErrorEmbed('Канал для репортов не установлен. Сообщите администратору.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const bugReportModal = this.buildBugReportModal();

      return await interaction.showModal(bugReportModal);
    }

    if (subcommand === 'get') {
      if (!interaction.member.permissions.has('ADMINISTRATOR')) {
        const embed = ErrorEmbed('Недостаточно прав');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const reportId = interaction.options.getNumber('id', true);

      const report = await client.service.getReport(interaction.guildId, reportId);

      const embed = await ReportsCommand.buildReportEmbed(report);
      const select = ReportsCommand.buildReportStatusSelect(report);

      return interaction.reply({ embeds: [embed], components: [select] });
    }

    if (subcommand === 'statistics') {
      const reports = await client.service.getReports(interaction.guildId);

      if (!reports.length) {
        const embed = ErrorEmbed('Репорты не найдены');
        return interaction.reply({ embeds: [embed] });
      }

      const newReports = reports.filter((report) => report.status === ReportStatus.New).length;
      const inProgressReports = reports.filter((report) => report.status === ReportStatus.InProgress).length;
      const declinedReports = reports.filter((report) => report.status === ReportStatus.Declined).length;
      const doneReports = reports.filter((report) => report.status === ReportStatus.Done).length;

      const mostReportedAuthor = this.mostFrequentValue(reports, 'authorId');
      const mostChangedAuthor = this.mostFrequentValue(reports, 'editedBy');

      const embed = new MessageEmbed()
        .setDescription(
          `# ${Emojis.Documents} Статистика баг-репортов
          
          **➤  Всего репортов:** ${reports.length}
          
          **➤  Новые:** ${newReports}
          **➤  В процессе:** ${inProgressReports}
          **➤  Отклонённые:** ${declinedReports}
          **➤  Сделанные:** ${doneReports}
          
          **➤  Больше всего репортов получено от:** <@${mostReportedAuthor.value}> (${mostReportedAuthor.count} репортов)
          ${mostChangedAuthor.count ? `**➤  Больше всего репортов изменено:** <@${mostChangedAuthor.value}> (${mostChangedAuthor.count} репортов)` : ''}`,
        )
        .setColor(Colors.Blue);

      return interaction.reply({ embeds: [embed] });
    }
  }

  async handleAutocomplete({ interaction, client }: AutocompleteRunOptions) {
    const focusedValue = interaction.options.getFocused(true);

    if (focusedValue.name !== 'id') {
      return;
    }

    const status = interaction.options.getString('status', true);

    const reports = await client.service.getReports(interaction.guildId);

    const mappedReports = reports
      .toReversed()
      .filter((report) => (status === 'Anything' ? true : report.status === status))
      .map((reports) => {
        return {
          name: `📄 Репорт №${reports.id} от ${client.users.cache.get(reports.authorId)?.displayName} в ${dayjs(reports.createdAt).format('HH:mm, DD.MM.YY')}`,
          value: String(reports.id),
        };
      });

    if (focusedValue.value === '') {
      await interaction.respond(mappedReports.slice(0, 25));
      return;
    }

    const searcher = new Searcher(mappedReports, {
      keySelector: (item) => item.name,
    });

    const filteredReports = searcher.search(focusedValue.value as string);

    await interaction.respond(filteredReports.slice(0, 25));
  }

  static buildReportEmbed(report: Report) {
    return new MessageEmbed()
      .setDescription(
        `# ${Emojis.Documents} Баг-репорт №${report.id}
        
### **➤ Автор:** <@${report.authorId}>
        
### **➤ Статус:** ${ReportsCommand.statusToString[report.status]}
        
### **➤ Описание:**
        
   ${report.description.trim()}
### **➤ Скриншоты:**
         
${report.links.trim() || '_Отсутствуют_'}
        
-# Репорт от **${dayjs(report.createdAt).format('HH:mm, DD.MM.YY')}**
${report.editedAt ? `-# Статус изменён **${Util.escapeMarkdown(client.users.cache.get(report.editedBy).displayName)}** в **${dayjs(report.editedAt).format('HH:mm, DD.MM.YY')}**` : ''}`,
      )
      .setColor(Colors.Blue);
  }

  static buildReportStatusSelect(report: Report): MessageActionRow<MessageSelectMenu> {
    const select = new MessageSelectMenu()
      .setCustomId(`report-status-select-${report.id}`)
      .setPlaceholder('Выберите статус баг-репорта')
      .addOptions([
        {
          label: 'Новый',
          value: ReportStatus.New,
          description: 'Новый баг-репорт',
          emoji: EmojisIDs.Add,
          default: report.status === ReportStatus.New,
        },
        {
          label: 'Отклонён',
          value: ReportStatus.Declined,
          description: 'Баг-репорт отклонён',
          emoji: EmojisIDs.No,
          default: report.status === ReportStatus.Declined,
        },
        {
          label: 'В процессе',
          value: ReportStatus.InProgress,
          description: 'Баг-репорт в процессе решения',
          emoji: EmojisIDs.Wrench,
          default: report.status === ReportStatus.InProgress,
        },
        {
          label: 'Сделан',
          value: ReportStatus.Done,
          description: 'Баг-репорт сделан',
          emoji: EmojisIDs.Yes,
          default: report.status === ReportStatus.Done,
        },
      ]);

    return new MessageActionRow<MessageSelectMenu>().addComponents(select);
  }

  private buildBugReportModal() {
    const modal = new Modal().setCustomId('report-modal').setTitle('Report a bug');

    const bugDescription = new TextInputComponent()
      .setCustomId('report-modal-description')
      .setPlaceholder('Опишите подробно ваш баг')
      .setLabel('Описание бага')
      .setRequired(true)
      .setStyle(2);
    const bugLinks = new TextInputComponent()
      .setCustomId('report-modal-links')
      .setPlaceholder('Добавьте скриншоты, если возможно')
      .setLabel('Ссылки на скриншоты')
      .setRequired(false)
      .setStyle(2);

    const firstRow = new MessageActionRow().addComponents(bugDescription);
    const secondRow = new MessageActionRow().addComponents(bugLinks);

    // @ts-ignore Fixed in d.js 14
    modal.addComponents(firstRow, secondRow);

    return modal;
  }

  private mostFrequentValue(array: unknown[], key: unknown): { value: unknown; count: number } | null {
    const frequencyMap: { [key: string]: number } = {};
    let mostFrequent: typeof key = '';
    let maxCount = 0;

    array.forEach((item) => {
      const value = item[key as string];
      if (value !== undefined) {
        frequencyMap[value] = (frequencyMap[value] || 0) + 1;
        if (frequencyMap[value] > maxCount) {
          maxCount = frequencyMap[value];
          mostFrequent = value;
        }
      }
    });

    return mostFrequent === null ? null : { value: mostFrequent, count: maxCount };
  }
}

export default new ReportsCommand();
