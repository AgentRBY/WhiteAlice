import {MessageEmbed} from 'discord.js';
import {inspect} from 'util';
import {Command} from '../../structures/Command';
import {ErrorEmbed} from '../../utils/Embed';
import {Colors} from '../../static/Colors';

export default new Command({
  name: 'eval',
  category: 'Owner',
  aliases: [],
  description: 'Выполняет JS код',
  usage: 'eval <code>',
  examples: [
    {
      command: 'eval console.log(\'\')',
      description: 'Выводит в консоль пустую строку',
    },
  ],
  ownerOnly: true,
  run: async ({ client, message, args }) => {
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
        embed.setFooter(`Обрезано ${response.length - 5950} символов`);
      }

      embed.setDescription(response);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (error) {
      const embed = new MessageEmbed().setColor(Colors.Red);
      let formattedError = error.message.replace(client.token, 'token').replace(client.config.mongoURI, 'mongouri');

      if (formattedError.length > 1950) {
        formattedError = formattedError.slice(0, 1950) + '...';
        embed.setFooter(`Обрезано ${formattedError.length - 5950} символов`);
      }

      embed.setDescription(formattedError);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  },
});
