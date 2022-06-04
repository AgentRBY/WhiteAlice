/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageEmbed } from 'discord.js';
import { inspect } from 'util';

import { ErrorEmbed } from '../../utils/Discord/Embed';
import { Colors } from '../../static/Colors';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class EvalCommand extends Command {
  name = 'eval';
  category = 'Owner';
  aliases = [];
  description = 'Выполняет JS код';
  usage = 'eval <code>';
  examples: CommandExample[] = [
    {
      command: 'eval console.log("")',
      description: 'Выводит в консоль пустую строку',
    },
  ];
  ownerOnly = true;

  async run({ client, message, args }: CommandRunOptions) {
    if (!args.length) {
      const errorEmbed = ErrorEmbed('**Введите любой код.**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }
    try {
      const result = await eval(args.join(' '));
      const embed = new MessageEmbed().setColor(Colors.Green);
      let response = await result;

      if (typeof response != 'string') {
        response = inspect(result);
      }
      if (response.includes(client.token)) {
        response = response.replace(client.token, 'token');
      }
      if (response.includes(client.config.sauceNAOToken)) {
        response = response.replace(client.config.sauceNAOToken, 'sauceNAOToken');
      }
      if (response.length > 5950) {
        response = response.slice(0, 5950) + '...';
        embed.setFooter({ text: `Обрезано ${response.length - 5950} символов` });
      }

      embed.setDescription(response);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (error) {
      const embed = new MessageEmbed().setColor(Colors.Red);
      let formattedError = error.message.replace(client.token, 'token').replace(client.config.mongoURI, 'mongouri');

      if (formattedError.length > 1950) {
        formattedError = formattedError.slice(0, 1950) + '...';
        embed.setFooter({ text: `Обрезано ${formattedError.length - 5950} символов` });
      }

      embed.setDescription(formattedError);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  }
}

export default new EvalCommand();
