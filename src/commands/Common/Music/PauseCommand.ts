import { SuccessEmbed } from '../../../utils/Discord/Embed';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

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

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue.playing) {
      await client.disTube.resume(message);
      const embed = SuccessEmbed('**Трек был возобновлён.**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    await client.disTube.pause(message);
    const embed = SuccessEmbed('**Трек был приостановлен.**');
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new PauseCommand();
