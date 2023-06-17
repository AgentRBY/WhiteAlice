import { Message, MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class PingCommand extends CommonCommand {
  name = 'ping';
  category = 'Information';
  description = `Показывает пинг:
   До сервера (высчитывается скорость выполнения запроса)
   До Discord (отправляется сообщение и высчитывается время между сообщением и текущим временем)`;
  usage = 'ping';
  examples: CommandExample[] = [
    {
      command: 'ping',
      description: 'Показывает пинг',
    },
  ];

  async run({ client, message }: CommandRunOptions) {
    const pingMessage: Message = await message.channel.send('Pinging...');
    pingMessage.delete();

    const embed = new MessageEmbed()
      .addFields([
        {
          name: '🖥️ До сервера',
          value: `${client.ws.ping}мс`,
          inline: true,
        },
        {
          name: `${Emojis.Discord} До Discord`,
          value: `${pingMessage.createdTimestamp - message.createdTimestamp}мс`,
          inline: true,
        },
      ])
      .setColor(Colors.Green);

    await message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  }
}

export default new PingCommand();
