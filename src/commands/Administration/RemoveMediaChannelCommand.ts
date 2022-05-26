import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { PermissionString } from 'discord.js';
import { Command, CommandRunOptions } from '../../structures/Command';

class RemoveMediaChannelCommand extends Command {
  name = 'removeMediaChannel';
  category = 'Administration';
  aliases = ['removeFromMediaChannels'];
  description = 'Удаляет канал из списка Каналов только для медиа контента';
  examples = [
    {
      command: 'removeMediaChannel 910989430557392947',
      description: 'Удалить канал с айди 910989430557392947 из списка Каналов только для медиа контента',
    },
  ];
  usage = 'removeMediaChannel <айди>';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
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
  }
}

export default new RemoveMediaChannelCommand();
