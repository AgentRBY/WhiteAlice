import { Message, MessageEmbed } from 'discord.js';
import { promisify } from 'util';
import { client } from '../../../app';
import { Colors } from '../../../static/Colors';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MusicIdentifyModel, Result } from '../../../typings/Audd';
import { isMediaLink, LINK_REGEX } from '../../../utils/Common/Strings';

const requset = promisify(require('request'));

export class FindMusic extends CommonCommand {
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
    const url = await FindMusic.tryToFindUrl(message);

    if (!url) {
      message.sendError('Видео/Аудио не найдено');
      return;
    }

    const music = await FindMusic.findMusic(url);

    if (!music) {
      message.sendError('Видео/Аудио не содержит песни или она не найдена');
      return;
    }

    const embed = FindMusic.generateEmbed(music);
    message.reply({ embeds: [embed] });
  }

  public static generateEmbed(music: Result) {
    const isAlbum = music.spotify.album.album_type !== 'single';
    const spotifyLink = `${music.spotify.external_urls.spotify}?go=1`;

    return new MessageEmbed()
      .setURL(music.song_link)
      .setTitle(music.title)
      .setDescription(
        `
      **Автор:** ${music.artist}${isAlbum ? `\n**Альбом:** ${music.album}` : ''}
      **Таймкод:** ${music.timecode}
      **Лейбл:** ${music.label}
      **Дата выхода:** ${music.release_date}
      **18+:** ${music.spotify.explicit ? 'Да' : 'Нет'}
      **Слушать:** [Все площадки](${music.song_link}) или [Перейти прямо в Spotify](${spotifyLink})`,
      )
      .setThumbnail(music.spotify.album.images[0].url)
      .setColor(Colors.Green);
  }

  public static async tryToFindUrl(message: Message, includeReference = true): Promise<string> {
    let url = message.attachments.find((attachment) => isMediaLink(attachment.url))?.url;

    if (url) {
      return url;
    }

    url = LINK_REGEX.exec(message.content)?.[0];

    if (isMediaLink(url)) {
      return url;
    }

    if (message.reference && includeReference) {
      const messageReference = await message.fetchReference();

      url = await this.tryToFindUrl(messageReference, false);
    }

    return url || '';
  }

  public static async findMusic(url: string): Promise<MusicIdentifyModel['result']> {
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
