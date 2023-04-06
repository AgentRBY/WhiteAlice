import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { isNumber } from '../../../utils/Common/Number';
import { InfoEmbed } from '../../../utils/Discord/Embed';

class RollCommand extends CommonCommand {
  name = 'roll';
  category = 'Utils';
  aliases = ['r'];
  description = `Позволяет сгенерировать случайное число из диапазона.
  Данная команда является упрощенной реализацией слеш-команды \`/roll\`.`;
  examples: CommandExample[] = [
    {
      command: 'roll',
      description: 'Генерирует случайное число в диапозоне [0;100]',
    },
    {
      command: 'roll 10',
      description: 'Генерирует случайное число в диапозоне [10;100]',
    },
    {
      command: 'roll -1024 1024',
      description: 'Генерирует случайное число в диапозоне [-1024;1024]',
    },
  ];
  usage = 'roll [<минимальное значение> [максимальное значение]]';

  async run({ message, args }: CommandRunOptions) {

    if (args.length > 2) {
      message.sendError('**Слишком много аргументов**');
      return;
    }

    if (args.length === 0) {
      message.sendSuccess(`Ваше случайное число [0;100] - \`${Math.floor(Math.random() * 101)}\``);
      return;
    }

    if (args.length === 1) {
      const min = Number(args[0]);

      if (!isNumber(min)) {
        message.sendError('**Укажите минимальное значение**');
        return;
      }

      message.sendSuccess(`Ваше случайное число [${min};100] - \`${Math.floor(Math.random() * (101 - min) + min)}\``);
    }

    const min = Number(args[0]);
    const max = Number(args[1]);

    if (min >= max - 1) {
      message.reply({
        embeds: [
          InfoEmbed('Я достигла комедии. Минимальное число не может быть больше максимального или равняться ему')
        ],
        allowedMentions: {
          repliedUser: false
        },
      });
      return;
    }

    message.sendSuccess(`Ваше случайное число [${min};${max - 1}] - \`${Math.floor(Math.random() * (max - min) + min)}\``)
  }
}

export default new RollCommand();
