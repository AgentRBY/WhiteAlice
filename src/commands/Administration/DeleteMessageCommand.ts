import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

export default new Command({
  name: 'deleteMessage',
  category: 'Administration',
  aliases: ['dmsg', 'delete'],
  description: 'Удаляет сообщение по айди',
  examples: [
    {
      command: 'deleteMessage 948518420524187648',
      description: 'Удаляет сообщение с айди 948518420524187648',
    },
  ],
  usage: 'deleteMessage <айди>',
  run: async ({ message, args }) => {
    const messageId = args[0];

    if (!messageId) {
      const embed = ErrorEmbed('Сообщение не найдено');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const fetchedMessage = await message.channel.messages
      .fetch(messageId)
      .then((m) => m)
      .catch(() => {
        const embed = ErrorEmbed('Сообщение не найдено');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      });

    console.log(fetchedMessage);
    if (!fetchedMessage) {
      return;
    }

    if (!fetchedMessage.deletable) {
      const embed = ErrorEmbed('Нет прав на удаление сообщения');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    fetchedMessage.delete();

    const embed = SuccessEmbed(`Сообщение от пользователя ${fetchedMessage.member} было удалено`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});