/* eslint-disable unicorn/prevent-abbreviations */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      environment: 'dev' | 'prod' | 'debug';
      prefix: string;
      owners: string;
      sauceNAOToken: string;
      mongoURI: string;
    }
  }
}

export {};
