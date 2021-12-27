export const LINK_REGEX = /https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/;
export const IMAGE_LINK_REGEX = /\.(?:png|jpeg|jpg|webp|bmp)$/;
export const VIDEO_LINK_REGEX = /\.mp4$/;
export const GIF_LINK_REGEX = /\.gif$/;

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

export async function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}