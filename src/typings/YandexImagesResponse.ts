export interface YandexImagesResponse {
  sites: Site[];
  pageSize: number;
  loadedPagesCount: number;
  faviconSpriteSeed: string;
  withFavicon: boolean;
  counterPaths: CounterPaths;
  lazyThumbsFromIndex: number;
  title: string;
}

export interface CounterPaths {
  item: string;
  itemThumbClick: string;
  itemTitleClick: string;
  itemDomainClick: string;
  loadPage: string;
}

export interface Site {
  title: string;
  description: string;
  url?: string;
  domain: string;
  thumb: OriginalImage;
  originalImage: OriginalImage;
}

export interface OriginalImage {
  url: string;
  height: number;
  width: number;
}

export interface WhitelistSite {
  url: string;
  type: WhitelistedSitesType;
}

export enum WhitelistedSitesType {
  BOORU_SITE = 'Сайт, содержащий набор картинок и тегов к ним (aka Имиджборд aka Booru-site) ',
  REDDIT_SOURCE = 'Саб-реддит Hentai_Source, где, возможно, нашли ответ откуда фулл вашей картинки',
  REDDIT_IWANTTOBEHERHENTAI = 'Саб-реддит IWantToBeHerHentai, где, возможно, есть фулл вашей картинки',
  MANGA_SITE = 'Сайт, на котором можно прочитать мангу',
}
