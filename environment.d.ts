/* eslint-disable unicorn/prevent-abbreviations */

export interface Environment {
  botToken: string;
  environment: 'dev' | 'prod' | 'debug';
  prefix: string;
  ownersID: string;
  sauceNAOToken: string;
  mongoURI: string;
  mode: 'production' | 'testing' | 'development';
  yandexYU: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Environment {}
  }
}
