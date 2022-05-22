import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { client } from '../../app';

export default new Command({
  name: 'removeMediaChannel',
  category: 'Administration',
  aliases: ['removeFromMediaChannels'],
  description: 'Удаляет канал из списка Каналов только для медиа контента',
  examples: [
    {
      command: 'removeMediaChannel 910989430557392947',
      description: 'Удалить канал с айди 910989430557392947 из списка Каналов только для медиа контента',
    },
  ],
  usage: 'removeMediaChannel <айди>',
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args }) => {
    const channelId = args[0];

    if (!channelId) {
      const embed = ErrorEmbed('Укажите айди канала');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!(await client.service.isMediaChannel(message.guildId, channelId))) {
      const embed = ErrorEmbed('Канал не найдено в списке Каналов только для медиа контента');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    client.service.removeMediaChannel(message.guildId, channelId);

    const embed = SuccessEmbed('Канал удален из списка Каналов только для медиа контента');
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
