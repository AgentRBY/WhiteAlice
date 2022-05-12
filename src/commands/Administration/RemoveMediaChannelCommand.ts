import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

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
  run: async ({ message, args, GuildData }) => {
    const channelId = args[0];

    if (!channelId) {
      const embed = ErrorEmbed('Укажите айди канала');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!GuildData.mediaChannels.includes(channelId)) {
      const embed = ErrorEmbed('Канал не найдено в списке Каналов только для медиа контента');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    GuildData.mediaChannels = GuildData.mediaChannels.filter((id) => id !== channelId);
    GuildData.save();

    const embed = SuccessEmbed('Канал удален из списка Каналов только для медиа контента');
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
