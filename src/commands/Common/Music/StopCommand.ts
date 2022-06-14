import { SuccessEmbed } from '../../../utils/Discord/Embed';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';

class StopCommand extends CommonCommand {
  name = 'stop';
  category = 'Music';
  aliases = ['leave', 'disconnect', 'стоп', 'остановить', 'выйти'];
  description = 'Завершает работу бота и выходит из канала';
  usage = 'stop';
  examples: CommandExample[] = [
    {
      command: 'stop',
      description: 'Завершает работу бота',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    await queue.stop();

    const embed = SuccessEmbed('**Выхожу...**');
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new StopCommand();
