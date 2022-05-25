import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { Command } from '../../structures/Command';

export default new Command({
  name: 'skip',
  category: 'Music',
  aliases: ['s'],
  description: 'Пропускает текущий трек. Если трек последний, завершает работу боту',
  usage: 'skip',
  examples: [
    {
      command: 'skip',
      description: 'Пропустить текущий трек',
    },
  ],
  run: async ({ client, message, args }) => {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (queue.songs.length === 1) {
      const errorEmbed = SuccessEmbed('**Это была последняя песня в плейлисте, бот будет остановлен**');
      await client.disTube.stop(message);
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    try {
      const skipCount = Number.isNaN(Number(args[0])) ? 1 : Number(args[0]);

      if (skipCount > queue.songs.length) {
        const errorEmbed = ErrorEmbed('**В плейлисте нет столько песен**');
        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      }

      if (skipCount > 10) {
        const errorEmbed = ErrorEmbed('**Нельзя пропустить больше 10 песен**');
        return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
      }

      for (let index = 0; index < skipCount; index++) {
        await client.disTube.skip(message);
      }

      const embed =
        skipCount > 1
          ? SuccessEmbed(
              `**Было пропущено ${skipCount} песен. Сейчас играет: 
         ➤ ${queue.songs[skipCount - 1].name} - \`${queue.songs[skipCount - 1].formattedDuration}\`**`,
            )
          : SuccessEmbed(
              `**Песня была пропущена. Сейчас играет: 
         ➤ ${queue.songs[0].name} - \`${queue.songs[0].formattedDuration}\`**`,
            );
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    } catch (error) {
      const errorEmbed = ErrorEmbed(`**Произошла ошибка ${error}**`);
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }
  },
});
