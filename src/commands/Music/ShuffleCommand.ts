import { Command } from '../../structures/Command';
import { client } from '../../app';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

export default new Command({
  name: 'shuffle',
  category: 'Music',
  aliases: ['random'],
  description: 'Перемешивает песни в плейлисте',
  examples: [
    {
      command: 'shuffle',
      description: 'Перемешивает песни в плейлисте',
    },
  ],
  usage: 'shuffle',
  run: async ({ message }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    await queue.shuffle();

    const embed = SuccessEmbed('**Плейлист перемешан**');
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
