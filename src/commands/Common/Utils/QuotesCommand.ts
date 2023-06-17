import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class Quotes extends CommonCommand {
  name = 'quotes';
  category = 'Utils';
  aliases = [];
  description = 'Выводит список цитат';
  examples: CommandExample[] = [
    {
      description: 'Вывести список цитат',
      command: 'quotes',
    },
  ];
  usage = 'quotes';

  async run({ message, client }: CommandRunOptions) {
    const quotes = await client.service.getQuotes(message.guild.id);

    if (!quotes.length) {
      message.sendError('Цитаты не найдены');
      return;
    }

    const embed = new MessageEmbed()
      .setTitle(`Цитаты сервера ${message.guild.name}`)
      .setColor(Colors.Green)
      .setDescription(
        quotes
          .map((quote, index) => {
            const author = message.guild.members.cache.get(quote.author);

            return `**${index + 1}.** ${quote.content} - ${author?.user.tag}`;
          })
          .join('\n'),
      );

    message.reply({ embeds: [embed] });
  }
}

export default new Quotes();
