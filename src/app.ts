import {ExtendClient} from './structures/Client';

require('dotenv').config();

export const client = new ExtendClient();

client.start();
