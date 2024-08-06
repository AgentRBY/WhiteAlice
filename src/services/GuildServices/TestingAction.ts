import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';
import { Report, ReportStatus } from '../../typings/GuildModel';

export class TestingAction {
  async getReportsChannel(this: Service, id: Snowflake): Promise<string> {
    const GuildData = await this.getGuildData(id);

    return GuildData.testing.reportsChannel;
  }

  async setReportsChannel(this: Service, id: Snowflake, channelId: Snowflake) {
    const GuildData = await this.getGuildData(id);

    GuildData.testing.reportsChannel = channelId;

    await this.updateGuildData(id, GuildData);
  }

  async addReport(this: Service, id: Snowflake, report: Omit<Report, 'id' | 'status' | 'createdAt' | 'editedAt'>) {
    const GuildData = await this.getGuildData(id);

    const newReport = {
      ...report,
      id: GuildData.testing.reports.length + 1,
      status: ReportStatus.New,
      createdAt: Date.now(),
    };

    GuildData.testing.reports.push(newReport);

    await this.updateGuildData(id, GuildData);

    return newReport;
  }

  async changeReportStatus(this: Service, id: Snowflake, reportId: number, status: Report['status'], editedBy: string) {
    const GuildData = await this.getGuildData(id);

    const report = GuildData.testing.reports.find((report) => report.id === reportId);

    if (!report) {
      return;
    }

    report.status = status;
    report.editedAt = Date.now();
    report.editedBy = editedBy;

    await this.updateGuildData(id, GuildData);

    return report;
  }

  async getReports(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.testing.reports;
  }

  async getReport(this: Service, id: Snowflake, reportId: number) {
    const GuildData = await this.getGuildData(id);

    return GuildData.testing.reports.find((report) => report.id === reportId);
  }
}
