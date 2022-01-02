import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { upAllFirstLatter } from '../../utils/strings';
import { Emojis, EmojisLinks } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { ErrorEmbed } from '../../utils/Embed';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'help',
  category: 'Information',
  aliases: ['commands', 'хелп', 'команды', 'h'],
  description: 'Показывает список всех команд или информацию по конкретной команде',
  usage: 'help [команда]',
  examples: [
    {
      command: 'help',
      description: 'Показывает список всех команд',
    },
    {
      command: 'help ping',
      description: 'Показывает информацию о команде `ping`',
    },
  ],
  run: async ({ client, message, args }) => {
    const { prefix } = client.config;
    if (!args.length) {
      const fields: EmbedFieldData[] = [...client.categories.keys()].map((category) => {
        return {
          name: `${upAllFirstLatter(category)} [${
            client.commands.filter((command) => command.category.toLowerCase() === category.toLowerCase()).size
          }]`,
          value: client.commands
            .filter((command) => command.category.toLowerCase() === category.toLowerCase())
            .map((command) => `\`${command.name}\``)
            .join(', '),
        };
      });

      const commandsEmbed = new MessageEmbed({
        fields,
      })
        .setDescription(
          `${Emojis.Info} **Всего \`${client.commands.size}\` команд в \`${client.categories.size}\` категориях **`,
        )
        .setFooter(`Что бы увидеть подробно про каждую команду, используйте: ${prefix}help [имя команды]`)
        .setColor(Colors.Blue);

      return message.reply({ embeds: [commandsEmbed], allowedMentions: { repliedUser: false } });
    }

    const command =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.get(client.aliases.get(args[0].toLowerCase()) || '');

    if (!command) {
      const errorEmbed = ErrorEmbed(`**Команда не найдена. Введите \`${prefix}help\` для списка команд**`);
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    let description = `**Команда**: \`${prefix}${command.name}\`
    **Категория**: ${command.category}`;
    if (command.description) {
      description += `
    **Описание**: ${command.description}`;
    }
    if (command.ownerOnly) {
      description += `
    __**Только для создателей**__: Эта команда доступна только для создателей бота`;
    }
    if (command.aliases?.length) {
      description += `
    **Алиасы**: \n┗ ${command.aliases.map((alias) => `\`${prefix}${alias}\``).join(', ')}`;
    }
    if (command.usage) {
      description += `\n
    **Использование**: \n┗ \`${prefix}${command.usage}\``;
    }
    if (command.examples.length) {
      description += '\n';
      command.examples.forEach((example, index) => {
        if (example.command !== '' && example.description !== '') {
          description += `
          **Пример ${++index}:**
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
    return await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
