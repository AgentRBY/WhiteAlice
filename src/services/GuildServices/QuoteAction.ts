import { Snowflake } from 'discord.js';
import { Searcher } from 'fast-fuzzy';
import { Service } from '../../structures/Service';

export class QuoteAction {
  async getQuotes(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.quotes;
  }

  async findQuotesByContent(this: Service, id: Snowflake, content: string) {
    const GuildData = await this.getGuildData(id);

    const searcher = new Searcher(GuildData.quotes, {
      keySelector: (item) => item.content,
    });

    return searcher.search(content);
  }

  async addQuote(this: Service, id: Snowflake, quote: string, author: string) {
    const GuildData = await this.getGuildData(id);

    const newQuote = {
      content: quote,
      author,
      createdAt: Date.now(),
    };

    GuildData.quotes.push(newQuote);
    GuildData.save();

    return newQuote;
  }
}
