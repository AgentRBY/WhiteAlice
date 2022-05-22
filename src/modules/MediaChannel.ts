import { ExtendClient } from '../structures/Client';
import { Message, MessageEmbed } from 'discord.js';
import { Colors } from '../static/Colors';
import { Emojis } from '../static/Emojis';

export async function MediaChannel(client: ExtendClient, message: Message): Promise<void> {
  const mediaChannels = await client.service.getMediaChannels(message.guild.id);

  if (!mediaChannels.includes(message.channelId)) {
    return;
  }

  if (!message.content || message.attachments.size) {
    return;
  }

  if (
    message.member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0 ||
    message.member.permissions.has('ADMINISTRATOR')
  ) {
    return;
  }

  if (message.deletable) {
    message.delete();
    message.member.timeout(10 * 1000, `${client.user.username} | Сообщение в неправильный канал`);

    const embed = new MessageEmbed().setColor(Colors.Blue).setDescription(`
        ${Emojis.Info} **В канал ${message.channel} запрещено писать.** 
        Он доступен только для изображений или любого другого медиа контента.
        Если вы хотите прокомментировать какой-либо контент от другого участника просто создайте ветку
      `);

    message.member.send({ embeds: [embed] });
  }
}
