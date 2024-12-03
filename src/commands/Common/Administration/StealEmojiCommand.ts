import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { isDiscordEmojiLink, isLink, removeQueryParameters } from '../../../utils/Common/Strings';
import { DiscordAPIError, PermissionString, SnowflakeUtil } from 'discord.js';

class StealEmoji extends CommonCommand {
  name = 'stealEmoji';
  category = 'Administration';
  aliases = [];
  description = 'Добавить эмодзи с чужого сервера или по ссылке';
  examples: CommandExample[] = [
    {
      command: 'stealEmoji :emoji:',
      description: 'Добавить эмодзи с чужого сервера',
    },
    {
      command: 'stealEmoji https://cdn.discordapp.com/emojis/123456789.png',
      description: 'Добавить эмодзи с ссылки на эмодзи',
    },
  ];
  usage = 'stealEmoji <ссылка | эмодзи> [название эмодзи]';
  botPermissions: PermissionString[] = ['MANAGE_EMOJIS_AND_STICKERS'];
  memberPermissions: PermissionString[] = ['MANAGE_EMOJIS_AND_STICKERS'];

  async run({ message, args }: CommandRunOptions) {
    const linkOrEmoji = args[0];

    if (!linkOrEmoji) {
      message.sendError('**Введите ссылку на эмодзи или сам эмодзи**');
      return;
    }

    const isEmojiLink = isLink(linkOrEmoji);

    if (isEmojiLink && !isDiscordEmojiLink(linkOrEmoji)) {
      message.sendError('**Ссылка не является эмоджи**');
      return;
    }

    const link = isEmojiLink ? linkOrEmoji : this.generateEmojiLink(linkOrEmoji);

    const name = args[1] || (isEmojiLink ? SnowflakeUtil.generate() : this.getEmojiName(linkOrEmoji));

    if (name.length > 32) {
      return message.sendError('**Имя эмодзи не должно превышать 32 символа**');
    }

    if (message.guild.emojis.cache.some((emoji) => emoji.name === name)) {
      return message.sendError('**Эмодзи с таким именем уже существует на сервере**');
    }

    message.guild.emojis
      .create(this.getHighQualityEmoji(link), name)
      .then((emoji) => {
        message.sendSuccess(`**Эмодзи ${emoji.toString()} (\`:${emoji.name}:\`) успешно добавлено**`);
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof DiscordAPIError && error.message.includes('Maximum number of emojis reached')) {
          return message.sendError('**Не удалось добавить эмодзи, все свободные слоты заняты**');
        }

        message.sendError('**Не удалось добавить эмодзи**');
      });
  }

  private getHighQualityEmoji(link: string) {
    const query = new URLSearchParams(link.split('?')?.[1]);

    query.set('size', '4096');
    query.set('quality', 'lossless');

    let baseLink = removeQueryParameters(link);

    if (baseLink.endsWith('.webp')) {
      baseLink = baseLink.replace('.webp', '.png');
    }

    return baseLink + '?' + query.toString();
  }

  private generateEmojiLink(emoji: string) {
    const emojiId = emoji.split(':')[2].replace('>', '');

    return `https://cdn.discordapp.com/emojis/${emojiId}.png`;
  }

  private getEmojiName(emoji: string) {
    return emoji.split(':')[1];
  }
}

export default new StealEmoji();
