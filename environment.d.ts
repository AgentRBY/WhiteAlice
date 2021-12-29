/* eslint-disable unicorn/prevent-abbreviations */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string;
      environment: 'dev' | 'prod' | 'debug';
      prefix: string;
      ownersID: string;
      sauceNAOToken: string;
      mongoURI: string;
      mode: 'production' | 'testing' | 'development';
    }
  }
}

export {};
