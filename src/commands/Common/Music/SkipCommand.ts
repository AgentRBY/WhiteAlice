import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';
import { isNumber } from '../../../utils/Common/Number';

class SkipCommand extends CommonCommand {
  name = 'skip';
  category = 'Music';
  aliases = ['s'];
  description = 'Пропускает текущий трек. Если трек последний, завершает работу боту';
  usage = 'skip';
  examples: CommandExample[] = [
    {
      command: 'skip',
      description: 'Пропустить текущий трек',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (queue.songs.length === 1) {
      await client.disTube.stop(message);
      message.sendSuccess('**Это была последняя песня в плейлисте, бот будет остановлен**');
      return;
    }

    const skipCount = Number(args[0] || 1);

    if (!isNumber(skipCount) || skipCount < 1) {
      message.sendError('**Вы указали неправильное число пропусков**');
      return;
    }

    if (skipCount > queue.songs.length) {
      message.sendError('**В плейлисте нет столько песен**', {
        footer: {
          text: `Текущее количество песен в плейлисте: ${queue.songs.length}`,
        },
      });
      return;
    }

    await queue.jump(skipCount);

    if (skipCount > 1) {
      message.sendSuccess(
        `**Было пропущено ${skipCount} песен. Сейчас играет: 
        ➤ ${queue.songs[1].name} - \`${queue.songs[1].formattedDuration}\`**`,
      );
      return;
    }

    message.sendSuccess(
      `**Песня была пропущена. Сейчас играет: 
      ➤ ${queue.songs[1].name} - \`${queue.songs[1].formattedDuration}\`**`,
    );
  }
}

export default new SkipCommand();
