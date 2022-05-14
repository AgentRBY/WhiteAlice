import { Document } from 'mongoose';

export type MongoData<T> = Document<unknown, unknown, T> & T;