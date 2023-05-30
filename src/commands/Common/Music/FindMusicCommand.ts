import { Message, MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { client } from '../../../app';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MusicIdentifyModel } from '../../../typings/Audd';
import { isMediaLink, LINK_REGEX } from '../../../utils/Common/Strings';

const requset = promisify(require('request'));

class FindMusic extends CommonCommand {
  name = 'findMusic';
  category = 'Music';
  aliases = ['fm'];
  description =
    'Позволяет искать музыку в видео и аудио. Упомяните сообщение, прикрепите файл или предоставьте ссылку для работы';
  examples: CommandExample[] = [
    {
      description: 'Найти музыку по ссылке',
      command: 'findMusic https://somesite.com/music.mp3',
    },
  ];
  usage = 'findMusic [url]';

  async run({ message }: CommandRunOptions) {
    const url = await this.tryToFindUrl(message);

    if (!url) {
      message.sendError('Аудио не найдено');
      return;
    }

    const music = await this.findMusic(url);

    const isAlbum = music.spotify.album.album_type !== 'single';
    const spotifyLink = `${music.spotify.external_urls.spotify}?go=1`;

    const embed = new MessageEmbed()
      .setURL(music.song_link)
      .setTitle(music.title)
      .setDescription(
        `
      **Автор:** ${music.artist}${isAlbum ? `**Альбом:** ${music.album}` : ''}
      **Таймкод:** ${music.timecode}
      **Лейбл:** ${music.label}
      **Дата выхода:** ${music.release_date}
      **18+:** ${music.spotify.explicit ? 'Да' : 'Нет'}
      **Слушать:** [Все площадки](${music.song_link}) или [Перейти прямо в Spotify](${spotifyLink})`,
      )
      .setThumbnail(music.spotify.album.images[0].url)
      .setColor(Colors.Green);
    message.reply({ embeds: [embed] });
  }

  private async tryToFindUrl(message: Message) {
    let url = message.attachments.find((attachment) => isMediaLink(attachment.url))?.url;

    if (url) {
      return url;
    }

    if (message.reference) {
      const messageReference = await message.fetchReference();

      url = messageReference.attachments.find((attachment) => isMediaLink(attachment.url))?.url;
    }

    if (url) {
      return url;
    }

    url = LINK_REGEX.exec(message.content)?.[0];

    if (isMediaLink(url)) {
      return url;
    }

    return '';
  }

  private async findMusic(url: string): Promise<MusicIdentifyModel['result']> {
    const response = await requset({
      method: 'POST',
      url: 'https://api.audd.io/',
      body: {
        api_token: client.config.auddToken,
        url,
        return: 'spotify',
      },
      json: true,
    });

    return response.body.result;
  }
}

export default new FindMusic();
