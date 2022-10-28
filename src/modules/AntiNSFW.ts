import { Message } from 'discord.js';
import { promisify } from 'util';
import { ExtendClient } from '../structures/Client';
import { ErrorEmbed } from '../utils/Discord/Embed';

const requset = promisify(require('request'));

export async function AntiNSFW(client: ExtendClient, message: Message) {
  if (!message.attachments.size) {
    return;
  }

  if (message.channel.id !== '1005547146449260580') {
    return;
  }

  const attachments = [...message.attachments.values()];

  for (const attachment of attachments) {
    if (!attachment.contentType.startsWith('image')) {
      continue;
    }

    if (attachment.spoiler) {
      continue;
    }

    const response = await requset({
      method: 'POST',
      url: 'https://nsfw-image-classification1.p.rapidapi.com/img/nsfw',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '6b548db738msh8a8fcd4a86a9cb0p116d8cjsn21720086d90b',
        'X-RapidAPI-Host': 'nsfw-image-classification1.p.rapidapi.com',
        useQueryString: true,
      },
      body: { url: attachment.url },
      json: true,
    });

    if (response.body.NSFW_Prob > 0.9) {
      message.delete().catch(() => {});

      const embed = ErrorEmbed('Картинка не прошла проверку на NSFW');
      message.channel.send({ embeds: [embed] }).then((message_) => {
        setTimeout(() => {
          message_.delete().catch(() => {});
        }, 5000);
      });

      break;
    }
  }
}
