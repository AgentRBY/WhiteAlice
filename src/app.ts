import { ExtendClient } from './structures/Client';

require('dotenv').config();

export const client = new ExtendClient();
try {
  client.start();
} catch (e) {
  console.log(e);
}
