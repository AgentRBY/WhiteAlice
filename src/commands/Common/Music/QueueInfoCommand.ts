import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed } from 'discord.js';
import { EmojisLinks } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class QueueInfoCommand extends CommonCommand {
  name = 'queueInfo';
  category = 'Music';
  aliases = ['qi'];
  description = 'Показывает информацию о текущем плейлисте';
  examples: CommandExample[] = [];
  usage = 'queueInfo';

  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const embed = new MessageEmbed()
      .setAuthor({
        name: 'Плейлист',
        iconURL: EmojisLinks.Headphone,
      })
      .setColor(Colors.Green);

    const repeatModes = ['Выключен', 'Повторение песни', 'Повторение плейлиста'];

    const description = `
    ➤ Количество песен в очереди: **${queue.songs.length}**
    ➤ Время прослушивания: **${queue.formattedDuration}**
    ➤ Текущий режим повторения: **${repeatModes[queue.repeatMode]}**
    ➤ Громкость бота: **${queue.volume}%**`;

    embed.setDescription(description);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new QueueInfoCommand();
