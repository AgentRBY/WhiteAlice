import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class ShuffleCommand extends Command {
  name = 'shuffle';
  category = 'Music';
  aliases = ['random'];
  description = 'Перемешивает песни в плейлисте';
  examples: CommandExample[] = [
    {
      command: 'shuffle',
      description: 'Перемешивает песни в плейлисте',
    },
  ];
  usage = 'shuffle';

  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    await queue.shuffle();

    const embed = SuccessEmbed('**Плейлист перемешан**');
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new ShuffleCommand();
