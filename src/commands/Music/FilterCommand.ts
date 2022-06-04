import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { AvailableFilters } from '../../static/Music';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class FilterCommand extends Command {
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

  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const filter = args[0];

    if (!filter) {
      const activeFilters = queue.filters.join('`, `');

      const embed = SuccessEmbed(`Текущие фильтры: \`${activeFilters || 'отсутствуют'}\``);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (filter === 'list') {
      const availableFilters = [...AvailableFilters].join('`, `');
      const embed = SuccessEmbed(`Доступные фильтры: \`${availableFilters}\``);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const disableAliases = new Set(['false', 'disable', 'clear', 'remove', 'off', 'clean']);

    if (disableAliases.has(filter)) {
      queue.setFilter(false);
      const embed = SuccessEmbed('Фильтры убраны');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!AvailableFilters.has(filter)) {
      const embed = ErrorEmbed('Фильтр не найден');
      embed.setFooter({ text: 'Что-бы узнать доступные фильтры пропишите >filters list' });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    queue.setFilter(filter);

    const embed = SuccessEmbed(`Фильтр \`${filter}\` успешно применён`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new FilterCommand();
