import { Message, Snowflake, SnowflakeUtil } from 'discord.js';
import { isMediaLink, LINK_REGEX } from '../Common/Strings';

export async function tryToFindUrl(
  message: Message,
  includeReference = true,
  checkIsLinkFunction: (text: string) => boolean = () => true,
): Promise<string> {
  let url = message.attachments.find((attachment) => isMediaLink(attachment.url))?.url;

  if (url) {
    return url;
  }

  url = LINK_REGEX.exec(message.content)?.[0];

  if (checkIsLinkFunction(url)) {
    return url;
  }

  if (message.reference && includeReference) {
    const messageReference = await message.fetchReference();

    url = await tryToFindUrl(messageReference, false);
  }

  return url || '';
}

export function isSnowflake(id: any): id is Snowflake {
  try {
    return SnowflakeUtil.deconstruct(id).timestamp > SnowflakeUtil.EPOCH;
  } catch {
    return false;
  }
}
