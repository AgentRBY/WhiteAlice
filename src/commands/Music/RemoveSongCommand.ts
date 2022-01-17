import { Command } from '../../structures/Command';
import { client } from '../../app';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

export default new Command({
  name: 'removeSong',
  category: 'Music',
  aliases: ['rs', 'deleteSong'],
  description: '',
  examples: [],
  usage: 'removeSong',
  run: async ({ message, args }) => {
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
      embed.setFooter('Примечание: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (songId <= 0 || songId > queue.songs.length) {
      const embed = ErrorEmbed('**Песни под данным айди не найдено**');
      embed.setFooter('Примечание: айди трека это - номер трека в плейлисте, его можно узнать прописав команду >queue');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const deletedSong = queue.songs.splice(songId, 1)[0];

    const embed = SuccessEmbed(`**Песня \`${deletedSong.name}\` - \`${deletedSong.uploader.name}\` удалена**`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
