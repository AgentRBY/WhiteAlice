import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class PauseCommand extends CommonCommand {
  name = 'pause';
  category = 'Music';
  aliases = ['hold', 'пауза'];
  description = 'Останавливает воспроизведение';
  usage = 'pause';
  examples: CommandExample[] = [
    {
      command: 'pause',
      description: 'Остановить воспроизведение текущего трека',
    },
  ];

  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Сейчас нет активных сессий**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (!queue.playing) {
      const embed = SuccessEmbed('**Трек был возобновлён.**');
      await client.disTube.resume(message);
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    await client.disTube.pause(message);
    const embed = SuccessEmbed('**Трек был приостановлен.**');
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new PauseCommand();
