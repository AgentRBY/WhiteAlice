import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

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
      const errorEmbed = SuccessEmbed('**Это была последняя песня в плейлисте, бот будет остановлен**');
      await client.disTube.stop(message);
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    const skipCount = Number(args[0] || 1);

    if (!isNumber(skipCount) || skipCount < 1) {
      const embed = ErrorEmbed('**Вы указали неправильное число пропусков**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (skipCount > queue.songs.length) {
      const errorEmbed = ErrorEmbed('**В плейлисте нет столько песен**').setFooter({
        text: `Текущее количество песен в плейлисте: ${queue.songs.length}`,
      });
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    await queue.jump(skipCount);

    console.log(queue.songs);
    const embed = SuccessEmbed(
      skipCount > 1
        ? `**Было пропущено ${skipCount} песен. Сейчас играет: 
         ➤ ${queue.songs[1].name} - \`${queue.songs[1].formattedDuration}\`**`
        : `**Песня была пропущена. Сейчас играет: 
         ➤ ${queue.songs[1].name} - \`${queue.songs[1].formattedDuration}\`**`,
    );
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new SkipCommand();
