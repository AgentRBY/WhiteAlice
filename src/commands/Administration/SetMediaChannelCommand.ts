import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { PermissionString } from 'discord.js';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class SetMediaChannelCommand extends Command {
  name = 'setMediaChannel';
  category = 'Administration';
  aliases = ['addToMediaChannels'];
  description = 'Добавляет канал в список Каналов только для медиа контента';
  examples: CommandExample[] = [
    {
      command: 'setMediaChannel 910989430557392947',
      description: 'Добавить канал с айди 910989430557392947 в список Каналов только для медиа контента',
    },
  ];
  usage = 'setMediaChannel <айди>';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
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

    if (await client.service.isMediaChannel(message.guildId, channelId)) {
      const embed = ErrorEmbed('Канал уже добавлен');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    client.service.setMediaChannel(message.guildId, channelId);

    const embed = SuccessEmbed(`Канал <#${channelId}> добавлен как Канал только для медиа контента`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new SetMediaChannelCommand();
