import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

export default new Command({
  name: 'addMediaChannel',
  category: 'Administration',
  aliases: ['addToMediaChannels'],
  description: 'Добавляет канал в список Каналов только для медиа контента',
  examples: [
    {
      command: 'addMediaChannel 910989430557392947',
      description: 'Добавить канал с айди 910989430557392947 в список Каналов только для медиа контента',
    },
  ],
  usage: 'addMediaChannel <айди>',
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args, GuildData }) => {
    const channelId = args[0];

    if (!channelId) {
      const embed = ErrorEmbed('Укажите айди канала');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!message.guild.channels.cache.has(channelId)) {
      const embed = ErrorEmbed('Канала с таким айди не существует');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (message.guild.channels.cache.get(channelId).type !== 'GUILD_TEXT') {
      const embed = ErrorEmbed('Неверный тип канала. Укажите текстовый канал');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (GuildData.mediaChannels.includes(channelId)) {
      const embed = ErrorEmbed('Канал уже добавлен');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    GuildData.mediaChannels.push(channelId);
    await GuildData.save();

    const embed = SuccessEmbed(`Канал <#${channelId}> добавлен как Канал только для медиа контента`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
