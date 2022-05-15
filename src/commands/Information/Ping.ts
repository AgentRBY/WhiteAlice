import { Command } from '../../structures/Command';
import { Message, MessageEmbed } from 'discord.js';
import { Emojis } from '../../static/Emojis';
import { Colors } from '../../static/Colors';

export default new Command({
  name: 'ping',
  category: 'Information',
  description: `Показывает пинг:
   До сервера (высчитывается скорость выполнения запроса)
   До Discord (отправляется сообщение и высчитывается время между сообщением и текущим временем)`,
  usage: 'ping',
  examples: [
    {
      command: 'ping',
      description: 'Показывает пинг',
    },
  ],
  run: async ({ client, message }) => {
    const pingMessage: Message = await message.channel.send('Pinging...');
    pingMessage.delete();

    const embed = new MessageEmbed()
      .addField('🖥️ До сервера', `${client.ws.ping}мс`, true)
      .addField(`${Emojis.Discord} До Discord`, `${pingMessage.createdTimestamp - message.createdTimestamp}мс`, true)
      .setColor(Colors.Green);

    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
