import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getRandomInt, isNumber } from '../../../utils/Common/Number';

class RollCommand extends CommonCommand {
  name = 'roll';
  category = 'Utils';
  aliases = ['r'];
  description = `Позволяет сгенерировать случайное число из диапазона.
  Данная команда является упрощенной реализацией слеш-команды \`/roll\`.`;
  examples: CommandExample[] = [
    {
      command: 'roll',
      description: 'Генерирует случайное число в диапазоне [0;100]',
    },
    {
      command: 'roll 10',
      description: 'Генерирует случайное число в диапазоне [0;10]',
    }
  ];
  usage = 'roll [максимальное значение]';

  async run({ message, args }: CommandRunOptions) {

    if (args.length > 1) {
      message.sendError('**Слишком много аргументов**');
      return;
    }

    let max = 100;

    if (args.length === 1) {
      if (args[0].length > 4) {
        message.sendError('**Число выходит за допустимый диапазон**');
        return;
      }

      max = Number(args[0]);

      if (!isNumber(max)) {
        message.sendError('**Не удается распознать максимальное значение**');
        return;
      }
    }

    if (max <= 0) {
      message.sendError('Я достигла комедии. Минимальное число не может быть больше максимального или равняться ему');
      return;
    }

    const randomInteger = getRandomInt(0, max);

    message.sendSuccess(`Ваше случайное число [0;${max}] - \`${randomInteger}\``);
  }
}

export default new RollCommand();
