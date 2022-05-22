import moment from 'moment';
import { GuildMember } from 'discord.js';
import { MemberBaseId } from '../typings/MemberModel';

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

export function removeQueryParameters(text: string): string {
  return text.split('?')[0];
}

export async function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function isDuration(duration: moment.Duration): boolean {
  return duration.locale('en').humanize() !== moment.duration(0).humanize();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = any> = new (...args: any[]) => T;

export function serviceMixin(...actions: Constructor[]) {
  class BaseClass {}

  actions.forEach((actionClass) => {
    Object.entries(Object.getOwnPropertyDescriptors(actionClass.prototype)).forEach(([name, descriptor]) => {
      if (name === 'constructor') {
        return;
      }

      Object.defineProperty(BaseClass.prototype, name, descriptor);
    });
  });

  return BaseClass;
}

export function getMemberBaseId(member: GuildMember): MemberBaseId {
  return `${member.id}-${member.guild.id}`;
}
