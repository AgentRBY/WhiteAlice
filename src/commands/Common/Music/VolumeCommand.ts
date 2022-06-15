import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { IsChannelForMusic } from '../../../utils/Decorators/MusicDecorators';
import { isNumber } from '../../../utils/Common/Number';

class VolumeCommand extends CommonCommand {
  name = 'volume';
  category = 'Music';
  aliases = ['v', 'set-volume', 'громкость', 'установить-громкость'];
  description = 'Устанавливает громкость бота в процентах. По умолчанию значение громкости 50%';
  usage = 'volume <значение>';
  examples: CommandExample[] = [
    {
      command: 'volume 42',
      description: 'Устанавливает значения громкости на `42%`',
    },
    {
      command: 'volume default',
      description: 'Устанавливает значения громкости по умолчанию',
    },
  ];

  @IsChannelForMusic()
  async run({ client, message, args }: CommandRunOptions) {
    let volume = Number(args[0]);

    if (args[0] === 'default') {
      volume = 50;
    }

    if (!isNumber(volume) || volume > 100 || volume < 1) {
      message.sendError('**Укажите значение громкости в процентах от 1 до 100**');
    }

    await client.disTube.setVolume(message, volume);

    const embed = new MessageEmbed()
      .setColor(Colors.Green)
      .setDescription(`${Emojis.Microphone} **Значение громкости установлено на ${volume}**`);
    return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new VolumeCommand();
