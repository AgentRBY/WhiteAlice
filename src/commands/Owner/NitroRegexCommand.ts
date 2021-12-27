import {MessageEmbed} from 'discord.js';
import {Command} from '../../structures/Command';
import {DISCORD_NITRO_SCAM_REGEX} from '../../modules/Scam';
import {Colors} from '../../static/Colors';

export default new Command({
  name: 'nitro-regex',
  category: 'Owner',
  aliases: ['нитро-скам'],
  description: `Показывает REGEX по которому определяется являться ли ссылка скамом или, если есть первый аргумент, показывает является ли ссылка скамом.`,
  examples: [
    {
      command: 'nitro-regex',
      description: 'Выводит REGEX по которому определяет скам-ссылка',
    },
    {
      command: 'nitro-regex https://discord.com',
      description: 'Проверяет ссылку https://discord.com на нитро-скам',
    },
  ],
  usage: 'nitro-regex [link]',
  run: async ({ message, args }) => {
    const embed = new MessageEmbed().setColor(Colors.Green);
    if (args.length) {
      embed.setDescription(`${DISCORD_NITRO_SCAM_REGEX.test(args.join('')) ? 'Это скам' : 'Это не скам'}`);
    } else {
      const stringRegex = `${DISCORD_NITRO_SCAM_REGEX}`;
      embed.setDescription(`\`\`\`${stringRegex.slice(1, -1)}\`\`\``);
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
