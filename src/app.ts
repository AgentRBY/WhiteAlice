import { ExtendClient } from './structures/Client';
import Logger from './utils/Logger';
import durationPlugin from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { GlobalFonts } from '@napi-rs/canvas';
import path from 'node:path';

dayjs.extend(durationPlugin);

require('dotenv').config();

GlobalFonts.registerFromPath(
  path.join(__dirname, '..', '..', 'src', 'utils', 'Canvas', 'Font', 'SegoeUI.ttf'),
  'Segoe UI',
);

export const client = new ExtendClient();

try {
  (async () => await client.start())();
} catch (error) {
  Logger.error(error);
}

process.on('uncaughtException', (error) => {
  console.error(error);
});
