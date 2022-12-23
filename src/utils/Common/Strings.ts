import { MessageEmbed } from 'discord.js';

export function upFirstLetter(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

export function upAllFirstLatter(text: string): string {
  return text
    .split(' ')
    .map((word) => upFirstLetter(word))
    .join(' ');
}

export function formatNames(text: string, separator = ' '): string {
  return text
    .split(separator)
    .map((character) => upFirstLetter(character))
    .join(separator);
}

export const LINK_REGEX = /https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/;
export const IMAGE_LINK_REGEX = /\.(?:png|jpeg|jpg|webp|bmp)$/;
export const VIDEO_LINK_REGEX = /\.mp4$/;
export const GIF_LINK_REGEX = /\.gif$/;
export const TENOR_LINK_REGEX = /tenor\.com(\/.*)?\/view\//;

export function isLink(text: string): boolean {
  return LINK_REGEX.test(text);
}

export function isImageLink(text: string): boolean {
  return IMAGE_LINK_REGEX.test(text);
}

export function isVideoLink(text: string): boolean {
  return VIDEO_LINK_REGEX.test(text);
}

export function isGifLink(text: string): boolean {
  return GIF_LINK_REGEX.test(text);
}

export function isMediaLink(text: string): boolean {
  return isImageLink(text) || isVideoLink(text) || isGifLink(text);
}

export function isTenorLink(text: string) {
  if (!isLink(text)) {
    return false;
  }

  return TENOR_LINK_REGEX.test(text);
}

export function removeQueryParameters(text: string): string {
  return text.split('?')[0];
}

export function getTenorLink(embeds: MessageEmbed[]): string | undefined {
  for (const embed of embeds) {
    if (isTenorLink(embed.url)) {
      return embed.thumbnail.url;
    }
  }

  return;
}

export function removeLessAndGreaterSymbols(text: string): string {
  if (text.startsWith('<') && text.endsWith('>')) {
    return text.slice(1, -1);
  }

  return text;
}

export async function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
