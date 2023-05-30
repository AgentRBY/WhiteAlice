import phash from 'sharp-phash';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { isMediaLink } from '../../../utils/Common/Strings';
import { getBufferFromLink } from '../../../utils/Media/Images';
import { FindImageCommand } from './FindImageCommand';

class FindImageFromBase extends CommonCommand {
  name = 'findImageFromBase';
  category = 'Image Search';
  aliases = ['fifb', 'f'];
  description = '';
  examples: CommandExample[] = [];
  usage = 'findImageFromBase';

  async run({ message, args, client }: CommandRunOptions) {
    const link = FindImageCommand.getImageLink(message, args);

    if (!isMediaLink(link.toLowerCase())) {
      message.sendError(
        '**Ссылка не ведёт на изображение или видео. Допустимые форматы: `png, jpeg, jpg, webp, bmp, gif, mp4`**',
        {
          footer: { text: 'Для gif-анимаций и видео в поиске будет использоваться первый кадр' },
        },
      );
      return;
    }

    const imageBuffer = await getBufferFromLink(link);

    const imageHash = await phash(imageBuffer);

    console.log(await client.service.findImage(imageHash));
    //
    // console.log(imageHash);

    // const hash1 = await phash(firstImage);
    // const hash2 = await phash(secondImage);

    // console.log(hash2);
    // console.log(hash1);
    //
    // const distance = await dist(hash1, hash2);
    // console.log(distance);
  }
}

export default new FindImageFromBase();
