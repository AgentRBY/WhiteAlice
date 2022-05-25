import { ExtendClient } from './structures/Client';
import Logger from './utils/Logger';

require('dotenv').config();

export const client = new ExtendClient();

try {
  (async () => await client.start())();
} catch (error) {
  Logger.error(error);
}

process.on('uncaughtException', (error) => {
  Logger.error(error);
});
