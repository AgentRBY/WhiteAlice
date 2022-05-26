import { ErrorEmbed } from '../../utils/Discord/Embed';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { EmojisLinks } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { Command, CommandRunOptions } from '../../structures/Command';

class SearchCommand extends Command {
  name = 'search';
  category = 'Music';
  aliases = ['sc'];
  description = `Поиск песни через YouTube. По умолчанию выдаёт 10 результатов.
  Доступные атрибуты:
  -P - поиск по плейлистам
  -S - безопасный поиск
  
  Доступные ключи:
  hl:L или hl:Limit - устанавливает количество ответов при поиске, максимальное значение - 30`;
  examples = [
    {
      command: 'search Never Gonna Give You Up',
      description: 'Выдаёт 10 результатов по запросу `Never Gonna Give You Up`',
    },
    {
      command: 'search Never Gonna Give You Up hl:Limit 15',
      description: 'Выдаёт 15 результатов по запросу `Never Gonna Give You Up`',
    },
    {
      command: 'search convolk - I fucked up -S',
      description:
        'Выдаст ошибку, так как при безопасном поиске любые 16+ видео не попадают в результаты (в том числе и содержащие маты)',
    },
  ];
  usage = 'search <запрос>';

  async run({ client, message, args, attributes, keys }: CommandRunOptions) {
    if (!message.member?.voice.channel) {
      const embed = ErrorEmbed('**Вы не находитесь в голосовом канале**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    if (!args.length) {
      const embed = ErrorEmbed('**Вы не указали запрос**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    const limit = Number(keys.get('hl:Limit') || keys.get('hl:L')) || 10;

    if (limit > 30) {
      const embed = ErrorEmbed('**Лимит не может быть больше 30**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (limit < 0) {
      const embed = ErrorEmbed('**Лимит не может быть меньше нуля**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const searchType = attributes.has('P') ? 'playlist' : 'video';
    const safeSearch = attributes.has('S');

    const searchResults = await client.disTube
      .search(args.join(' '), {
        limit,
        type: searchType,
        safeSearch,
      })
      .then((results) => results)
      .catch(() => {});

    if (!searchResults) {
      const embed = ErrorEmbed('Результаты не найдены');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const formattedSearchResults = searchResults
      .map((result, index) => {
        if (result.type === 'playlist') {
          return `➤ **${index + 1}.** **${result.name}**`;
        }

        return `➤ **${index + 1}.** **${result.name}** - ${result.uploader.name} (\`${result.formattedDuration}\`)`;
      })
      .join('\n');

    const description = `**\`Введите номер одной из песен:\`** \n${formattedSearchResults}`;

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Поиск', iconURL: EmojisLinks.Headphone })
      .setDescription(description)
      .setColor(Colors.Green);

    if (searchType === 'playlist') {
      embed.setFooter({ text: 'Поиск по плейлистам' });
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

    const collectorFilter = (response: Message) => {
      return (
        response.author.id === message.author.id && Number(response.content) > 0 && Number(response.content) <= limit
      );
    };
    message.channel
      .awaitMessages({ filter: collectorFilter, max: 1, time: 30_000 })
      .then((collected) => {
        const songIndex = Number(collected.first().content) - 1;
        const song = searchResults[songIndex];

        client.disTube.play(message.member.voice.channel, song, {
          message,
          member: message.member,
          textChannel: message.channel as TextChannel,
        });
      })
      .catch(() => {
        const embed = ErrorEmbed('Вы не выбрали никакую песню');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      });
  }
}

export default new SearchCommand();
