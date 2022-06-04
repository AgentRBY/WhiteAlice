import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class RemoveSongCommand extends Command {
  name = 'removeSong';
  category = 'Music';
  aliases = ['rs', 'deleteSong'];
  description = 'Позволяет убрать песню по номеру. Номер песни можно узнать в команде >queue';
  examples: CommandExample[] = [
    {
      command: '>removeSong 3',
      description: 'Удаляет 3ю песню из плейлиста',
    },
  ];
  usage = 'removeSong';

  async run({ client, message, args }: CommandRunOptions) {
    const queue = client.disTube.getQueue(message);

    if (!queue) {
      const errorEmbed = ErrorEmbed('**Плейлист пуст**');
      return message.reply({ embeds: [errorEmbed], allowedMentions: { repliedUser: false } });
    }

    if (queue.songs.length === 1) {
      const embed = ErrorEmbed('**Нечего удалять**');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const songId = Number(args[0]);

    if (!songId || Number.isNaN(songId)) {
      const embed = ErrorEmbed('**Введите айди трека**');
      embed.setFooter({
        text: 'Примечание: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue',
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (songId <= 0 || songId > queue.songs.length) {
      const embed = ErrorEmbed('**Песни под данным айди не найдено**');
      embed.setFooter({
        text: 'Примечание: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue',
      });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const deletedSong = queue.songs.splice(songId - 1, 1)[0];

    const embed = SuccessEmbed(`**Песня \`${deletedSong.name}\` - \`${deletedSong.uploader.name}\` удалена**`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new RemoveSongCommand();
