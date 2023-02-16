import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis, EmojisLinks } from '../../../static/Emojis';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { upAllFirstLatter } from '../../../utils/Common/Strings';

class HelpCommand extends CommonCommand {
  name = 'help';
  category = 'Information';
  aliases = ['commands', 'h'];
  description = `Показывает список всех команд или информацию по конкретной команде
    
    Можно так же вызвать добавив к любой команде в конце ключ \`-h\`; например \`>ping -h\``;
  usage = 'help [команда]';
  examples: CommandExample[] = [
    {
      command: 'help',
      description: 'Показывает список всех команд',
    },
    {
      command: 'help ping',
      description: 'Показывает информацию о команде `ping`',
    },
  ];

  async run({ client, message, args }: CommandRunOptions) {
    const prefix = await client.getPrefix(message.guild.id);

    if (!args.length) {
      const fields: EmbedFieldData[] = [...client.categories.keys()].map((category) => {
        return {
          name: `${upAllFirstLatter(category)} [${
            client.commonCommands.filter((command) => command.category.toLowerCase() === category.toLowerCase()).size
          }]`,
          value: client.commonCommands
            .filter((command) => command.category.toLowerCase() === category.toLowerCase())
            .map((command) => `\`${command.name}\``)
            .join(', '),
        };
      });

      const commandsEmbed = new MessageEmbed({
        fields,
      })
        .setDescription(
          `${Emojis.Info} **Всего \`${client.commonCommands.size}\` команд в \`${client.categories.size}\` категориях **`,
        )
        .setFooter({ text: `Что бы увидеть подробно про каждую команду, используйте: ${prefix}help [имя команды]` })
        .setColor(Colors.Blue);

      return message.reply({ embeds: [commandsEmbed], allowedMentions: { repliedUser: false } });
    }

    const command =
      client.commonCommands.get(args[0].toLowerCase()) ||
      client.commonCommands.get(client.aliases.get(args[0].toLowerCase()) || '');

    if (!command) {
      message.sendError(`**Команда не найдена. Введите \`${prefix}help\` для списка команд**`);
      return;
    }

    let description = `**➤ Команда**: \`${prefix}${command.name}\`
    \n**➤ Категория**: \`${command.category}\``;

    if (command.description) {
      description += `
    \n**➤ Описание**: ${command.description}`;
    }

    if (command.ownerOnly) {
      description += `
    \n__**➤ Только для создателей**__: Эта команда доступна только для создателей бота`;
    }

    if (command.aliases?.length) {
      description += `
    \n**➤ Алиасы**: \n┗ ${command.aliases.map((alias) => `\`${prefix}${alias}\``).join(', ')}`;
    }

    if (command.usage) {
      description += `\n
    **➤ Использование**: \n┗ \`${prefix}${command.usage}\``;
    }

    if (command.examples.length) {
      description += '\n';
      command.examples.forEach((example, index) => {
        if (example.command !== '' && example.description !== '') {
          description += `
          **➤ Пример ${++index}:**
          \`${prefix}${example.command}\`
          ┗ ${example.description}
        `;
        }
      });
    }

    const embed = new MessageEmbed({
      author: {
        name: `Информация про команду ${command.name}`,
        iconURL: EmojisLinks.Info,
      },
      description: description.replace(/ +/g, ' ').replace(/(?:\n\s\*)+/g, '\n*'),
      footer: { text: 'Синтаксис: <> = обязательно, [] = опционально, | - или' },
      color: Colors.Blue,
    });

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new HelpCommand();
