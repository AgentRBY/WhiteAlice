import { MessageEmbed } from 'discord.js';

import { DISCORD_NITRO_SCAM_REGEX } from '../../../modules/AntiScam';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class NitroRegexCommand extends CommonCommand {
  name = 'nitro-regex';
  category = 'Owner';
  description =
    'Показывает REGEX по которому определяется являться ли ссылка скамом или, если есть первый аргумент, показывает является ли ссылка скамом.';
  examples: CommandExample[] = [
    {
      command: 'nitro-regex',
      description: 'Выводит REGEX по которому определяет скам-ссылка',
    },
    {
      command: 'nitro-regex https://discord.com',
      description: 'Проверяет ссылку https://discord.com на нитро-скам',
    },
  ];
  usage = 'nitro-regex [link]';

  async run({ message, args }: CommandRunOptions) {
    const embed = new MessageEmbed().setColor(Colors.Green);
    if (args.length) {
      embed.setDescription(`${DISCORD_NITRO_SCAM_REGEX.test(args.join('')) ? 'Это скам' : 'Это не скам'}`);
    } else {
      const stringRegex = `${DISCORD_NITRO_SCAM_REGEX}`;
      embed.setDescription(`\`\`\`${stringRegex.slice(1, -1)}\`\`\``);
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new NitroRegexCommand();
