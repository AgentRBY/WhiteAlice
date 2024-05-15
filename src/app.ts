import { ExtendClient } from './structures/Client';
import Logger from './utils/Logger';
import durationPlugin from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

dayjs.extend(durationPlugin);

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
