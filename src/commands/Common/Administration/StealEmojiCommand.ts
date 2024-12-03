import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { isDiscordEmojiLink, removeQueryParameters } from '../../../utils/Common/Strings';
import { DiscordAPIError, PermissionString, SnowflakeUtil } from 'discord.js';

class StealEmoji extends CommonCommand {
  name = 'stealEmoji';
  category = 'Administration';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'stealEmoji';
  botPermissions: PermissionString[] = ['MANAGE_EMOJIS_AND_STICKERS'];
  memberPermissions: PermissionString[] = ['MANAGE_EMOJIS_AND_STICKERS'];

  async run({ message, args }: CommandRunOptions) {
    const link = args[0];

    if (!link) {
      message.sendError('**Введите ссылку на эмодзи**');
      return;
    }

    if (!isDiscordEmojiLink(link)) {
      message.sendError('**Ссылка не является эмоджи**');
      return;
    }

    const name = args[1] || SnowflakeUtil.generate();

    message.guild.emojis
      .create(this.getHighQualityEmoji(link), name)
      .then((emoji) => {
        message.sendSuccess(`**Эмодзи ${emoji.toString()} (\`:${emoji.name}:\`) успешно добавлено**`);
      })
      .catch((error) => {
        if (error instanceof DiscordAPIError && error.message.includes('Maximum number of emojis reached')) {
          return message.sendError('**Не удалось добавить эмодзи, все свободные слоты заняты**');
        }

        message.sendError('**Не удалось добавить эмодзи**');
      });
  }

  private getHighQualityEmoji(link: string) {
    const query = new URLSearchParams(link);

    query.set('size', '4096');
    query.set('quality', 'lossless');

    let baseLink = removeQueryParameters(link);

    if (baseLink.endsWith('.webp')) {
      baseLink = baseLink.replace('.webp', '.png');
    }

    return baseLink + '?' + query.toString();
  }
}

export default new StealEmoji();
