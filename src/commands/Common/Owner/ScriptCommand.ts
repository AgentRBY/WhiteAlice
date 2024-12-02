/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { ColorResolvable, MessageEmbed } from 'discord.js';

class ScriptCommand extends CommonCommand {
  name = 'script';
  category = 'Owner';
  aliases = [];
  description = 'Выполняет тестовые скрипты';
  usage = 'script <имя_скрипта>';
  examples: CommandExample[] = [
    {
      command: 'script my_script',
      description: 'Выполнаяет my_script',
    },
  ];
  ownerOnly = true;
  hide = true;

  async run({ client, message, args }: CommandRunOptions) {
    const [scriptName, ...scriptArgs] = args;

    if (!scriptName) {
      message.sendError('**Введите имя скрипта**');
      return;
    }

    // Convert to format: title:"my title wtih \"quoutes\"" description:"my desc"
    const scriptArgsParser = <T extends Record<string, string>>() => {
      const args = scriptArgs.join(' ').match(/(?:[^\s"\\]+|"[^"\\]*(?:\\.[^"\\]*)*")+/g);

      if (!args) {
        return {} as T;
      }

      return args.reduce((accumulator, argument) => {
        const [key, ...value] = argument.split(':');

        accumulator[key] = value
          .join(':')
          .slice(1, -1)
          .replaceAll(String.raw`\"`, '"')
          .split(String.raw`\n`)
          .join('\n');

        return accumulator;
      }, {}) as T;
    };

    const scripts: Record<string, () => Promise<unknown>> = {
      my_script: async () => {
        message.reply('**Мой скрипт работает**');
      },
      embed_message: async () => {
        const { title, description, image, channelId, color, content, field1, field2 } = scriptArgsParser();

        if (!description) {
          message.sendError('**Введите описание**');
          return;
        }

        const embed = new MessageEmbed().setColor((color as ColorResolvable) || '#2b2d31').setDescription(description);

        if (title) {
          embed.setTitle(title);
        }

        if (image) {
          embed.setImage(image);
        }

        if (field1) {
          const [name, inline, ...value] = field1.split('|');
          embed.addFields({
            name,
            inline: inline === 'true',
            value: value.join('|'),
          });
        }

        if (field2) {
          const [name, inline, ...value] = field2.split('|');
          embed.addFields({
            name,
            inline: inline === 'true',
            value: value.join('|'),
          });
        }

        if (channelId) {
          const channel = client.channels.cache.get(channelId);

          if (channel.isText()) {
            channel.send({ content, embeds: [embed] });
          } else {
            message.reply('**Канал не является текстовым**');
          }
        } else {
          console.log('send');
          message.reply({ content, embeds: [embed] });
        }
      },
    };

    const script = scripts[scriptName];

    if (!script) {
      message.sendError('**Такого скрипта не существует**');
      return;
    }

    script()
      .then((result) => {
        if (result) {
          message.reply(result);
        }
      })
      .catch((error) => {
        message.sendError(`**Ошибка при выполнении скрипта**\n\`\`\`js\n${error}\n\`\`\``);
      });
  }
}

export default new ScriptCommand();
