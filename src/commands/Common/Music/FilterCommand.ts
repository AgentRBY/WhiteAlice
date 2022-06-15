import { AvailableFilters } from '../../../static/Music';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class FilterCommand extends CommonCommand {
  name = 'filter';
  category = 'Music';
  aliases = [];
  description = `Накладывает фильтр на песню. 
  Список доступных фильтров можно просмотреть по команде >filter list. 
  Что бы отключить фильтры пропишите >filter clear`;
  examples: CommandExample[] = [
    {
      command: 'filter bassboost',
      description: 'Включает фильтр bassboost к песне',
    },
    {
      command: 'filter clear',
      description: 'Очищает фильтры',
    },
    {
      command: 'filter list',
      description: 'Показывает все доступные фильтры',
    },
  ];
  usage = 'filter <имя фильтра | list | clear>';

  @IsChannelForMusic()
  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);
    const filter = args[0];

    if (!filter) {
      const activeFilters = queue.filters.join('`, `');

      message.sendSuccess(`Текущие фильтры: \`${activeFilters || 'отсутствуют'}\``);
      return;
    }

    if (filter === 'list') {
      const availableFilters = [...AvailableFilters].join('`, `');
      message.sendSuccess(`Доступные фильтры: \`${availableFilters}\``);
      return;
    }

    const disableAliases = new Set(['false', 'disable', 'clear', 'remove', 'off', 'clean']);

    if (disableAliases.has(filter)) {
      queue.setFilter(false);
      message.sendSuccess('Фильтры убраны');
      return;
    }

    if (!AvailableFilters.has(filter)) {
      message.sendError('Фильтр не найден', {
        footer: { text: 'Что-бы узнать доступные фильтры пропишите >filters list' },
      });
      return;
    }

    queue.setFilter(filter);

    message.sendSuccess(`Фильтр \`${filter}\` успешно применён`);
    return;
  }
}

export default new FilterCommand();
