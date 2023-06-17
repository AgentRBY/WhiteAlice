import { MessageEmbed, Util } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getRandomElement } from '../../../utils/Common/Array';

class Quote extends CommonCommand {
  name = 'quote';
  category = 'Utils';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'quote';

  async run({ message, args, client }: CommandRunOptions) {
    const searchContent = args.join(' ');

    const quotes = searchContent
      ? await client.service.findQuotesByContent(message.guild.id, searchContent)
      : await client.service.getQuotes(message.guild.id);

    if (!quotes.length) {
      message.sendError('**Цитата не найдена**');
      return;
    }

    const quote = getRandomElement(quotes);
    const quoteAuthor = message.guild.members.cache.get(quote.author);

    const embed = new MessageEmbed()
      .setTitle(`Цитата ${Util.escapeMarkdown(quoteAuthor.displayName)}`)
      .setDescription(quote.content)
      .setColor(Colors.Blue);

    message.reply({ embeds: [embed] });
  }
}

export default new Quote();
