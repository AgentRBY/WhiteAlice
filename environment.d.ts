/* eslint-disable unicorn/prevent-abbreviations */

export interface Environment {
  botToken: string;
  environment: 'development' | 'production';
  prefix: string;
  ownersID: string;
  sauceNAOToken: string;
  mongoURI: string;
  devGuildID: string;
  yandexYU: string;
  distubeCookie: string;
  notionToken: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
