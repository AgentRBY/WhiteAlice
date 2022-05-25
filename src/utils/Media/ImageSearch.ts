import { Response } from 'request';
import HTMLParser from 'node-html-parser';
import { YandexImagesResponse } from '../../typings/YandexImagesResponse';

export const generateYandexSearchLink = (imageLink: string, yu: string) => {
  const requestBody = {
    blocks: [
      {
        block: 'content_type_search-by-image',
        params: {},
        version: 2,
      },
    ],
  };

  let baseURL = 'https://yandex.ru/images/search?';
  baseURL += '&rpt=imageview'; // rpt
  baseURL += `&url=${imageLink}`; // image link
  baseURL += '&format=json'; // output format
  baseURL += `&request=${encodeURIComponent(JSON.stringify(requestBody))}`; // request type
  baseURL += `&yu=${yu}`; // unique user code

  return baseURL;
};

export const getSitesFromYandexResponse = (response: Response): YandexImagesResponse => {
  const parsedHTML = HTMLParser(JSON.parse(response.body).blocks[0].html);

  if (parsedHTML.querySelector('.CbirOtherSizes-EmptyMessage')) {
    return null;
  }

  const elementWithSites = parsedHTML
    .querySelectorAll('div.Root')
    .find((element) => element.id.startsWith('CbirSites'));

  return JSON.parse(elementWithSites.attributes['data-state']);
};
