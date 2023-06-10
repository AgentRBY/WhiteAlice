import { Message } from 'discord.js';
import { ContextCommand, ContextCommandRun, ContextCommandType } from '../../../structures/Commands/ContextCommand';
import { isMediaLink } from '../../../utils/Common/Strings';
import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { tryToFindUrl } from '../../../utils/Discord/Messages';
import { FindMusic } from '../../Common/Music/FindMusicCommand';

class ReportCommand extends ContextCommand {
  name = 'Найти музыку в этом сообщении';
  type: ContextCommandType = 'MESSAGE';

  async run({ interaction }: ContextCommandRun<'MESSAGE'>) {
    const message = interaction.targetMessage;

    if (!(message instanceof Message)) {
      const embed = ErrorEmbed('Ошибка');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const url = await tryToFindUrl(message, false, isMediaLink);

    if (!url) {
      const embed = ErrorEmbed('Видео/Аудио не найдено в этом сообщении');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const music = await FindMusic.findMusic(url);

    if (!music) {
      const embed = ErrorEmbed('Видео/Аудио не содержит песни или она не найдена');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = FindMusic.generateEmbed(music);
    interaction.reply({ embeds: [embed] });
  }
}

export default new ReportCommand();
