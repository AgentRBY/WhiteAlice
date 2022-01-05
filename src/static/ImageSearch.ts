import { WhitelistedSitesType, WhitelistSite } from '../typings/YandexImagesResponse';

export const yandexWhitelistSites: WhitelistSite[] = [
  {
    url: 'konachan.net',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'safebooru.org',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'danbooru.2chan.eu',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'gelbooru.com',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'chan.sankakucomplex.com',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'danbooru.donmai.us',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'rule34.us',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'xbooru.com',
    type: WhitelistedSitesType.BOORU_SITE,
  },
  {
    url: 'reddit.com/r/HentaiSource',
    type: WhitelistedSitesType.REDDIT_SOURCE,
  },
  {
    url: 'reddit.com/r/IWantToBeHerHentai',
    type: WhitelistedSitesType.REDDIT_IWANTTOBEHERHENTAI,
  },
  {
    url: 'nhentai.net/g/',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'nhentai.to/g/',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'simply-hentai.com',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'toonily.com/webtoon',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'mangaforfree.net/manga',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentaihbo.com',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentaiput',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentaiol.com',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentaiwoo.com',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentaidock.net',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'simply-hentai.info',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentaihub.info',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'hentai102.com',
    type: WhitelistedSitesType.MANGA_SITE,
  },
  {
    url: 'akuma.moe/g/',
    type: WhitelistedSitesType.MANGA_SITE,
  },
];

export const sauceNEORelevantSites = new Set(['AniDB', 'nHentai', 'Gelbooru', 'Danbooru', 'Yande.re', 'e621']);
