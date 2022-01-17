import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'stop',
  category: 'Music',
  aliases: ['leave', 'disconnect', 'стоп', 'остановить', 'выйти'],
  description: 'Завершает работу бота и выходит из канала',
  usage: 'stop',
  examples: [
    {
      command: 'stop',
      description: 'Завершает работу бота',
    },
  ],
  run: async ({ client, message }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue && !message.guild?.me?.voice.channel) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (message.guild?.me?.voice.channel) {
      message.guild?.me?.voice.disconnect();
    } else {
      await client.disTube.stop(message);
    }

    const embed = SuccessEmbed('**Выхожу...**');
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
