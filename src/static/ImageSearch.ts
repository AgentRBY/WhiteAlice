import { WhitelistedSitesType, WhitelistSite } from '../typings/YandexImagesResponse';

export const yandexWhitelistSites: WhitelistSite[] = [
  {
    url: 'konachan.net',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 0,
  },
  {
    url: 'safebooru.org',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 1,
  },
  {
    url: 'danbooru.2chan.eu',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 2,
  },
  {
    url: 'gelbooru.com',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 2,
  },
  {
    url: 'chan.sankakucomplex.com',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 1,
  },
  {
    url: 'danbooru.donmai.us',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 2,
  },
  {
    url: 'rule34.us',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 1,
  },
  {
    url: 'xbooru.com',
    type: WhitelistedSitesType.BOORU_SITE,
    priority: 0,
  },
  {
    url: 'reddit.com/r/HentaiSource',
    type: WhitelistedSitesType.REDDIT_SOURCE,
    priority: 1,
  },
  {
    url: 'reddit.com/r/IWantToBeHerHentai',
    type: WhitelistedSitesType.REDDIT_IWANTTOBEHERHENTAI,
    priority: 1,
  },
  {
    url: 'nhentai.net/g/',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 2,
  },
  {
    url: 'nhentai.to/g/',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 2,
  },
  {
    url: 'simply-hentai.com',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 1,
  },
  {
    url: 'toonily.com/webtoon',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'mangaforfree.net/manga',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentaihbo.com',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentaiput',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentaiol.com',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentaiwoo.com',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentaidock.net',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'simply-hentai.info',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentaihub.info',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'hentai102.com',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 0,
  },
  {
    url: 'akuma.moe/g/',
    type: WhitelistedSitesType.MANGA_SITE,
    priority: 1,
  },
];

export const sauceNAORelevantSites = new Set(['AniDB', 'nHentai', 'Gelbooru', 'Danbooru', 'Yande.re', 'e621']);
