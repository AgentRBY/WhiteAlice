import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';

export class AutoAnswerAction {
  async getAutoAnswers(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.autoAnswers;
  }

  async addAutoAnswer(this: Service, id: Snowflake, triggerRegex: string, answer: string) {
    const GuildData = await this.getGuildData(id);

    const newAutoAnswer = {
      id: GuildData.autoAnswers.length + 1,
      triggerRegex,
      answer,
    };

    GuildData.autoAnswers.push(newAutoAnswer);

    await this.updateGuildData(id, GuildData);

    return newAutoAnswer;
  }

  async removeAutoAnswer(this: Service, id: Snowflake, autoAnswerId: number) {
    const GuildData = await this.getGuildData(id);

    GuildData.autoAnswers = GuildData.autoAnswers.filter((autoAnswer) => autoAnswer.id !== autoAnswerId);

    await this.updateGuildData(id, GuildData);
  }
}
