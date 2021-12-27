import {ErrorEmbed, SuccessEmbed} from '../../utils/Embed';
import {Command} from '../../structures/Command';

export default new Command({
  name: 'resume',
  category: 'Music',
  aliases: [],
  description: 'Возобновляет трек, если он остановлен',
  usage: 'resume',
  examples: [
    {
      command: 'resume',
      description: 'Возобновляет трек',
    },
  ],
  run: async ({ client, message }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (queue.playing) {
      const embed = ErrorEmbed('**Трек не приостановлен.**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    const embed = SuccessEmbed('**Трек был возобновлён.**');
    await client.disTube.resume(message);
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
