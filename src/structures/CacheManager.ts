import { Collection } from 'discord.js';

interface CacheOptions<T> {
  getCallback: (id: string) => Promise<T>;
  maxCacheSize: number;
}

export class CacheManager<T> {
  private cache: Collection<string, T>;
  private readonly getCallback: (id: string) => Promise<T>;
  maxCacheSize: number;

  constructor(options: CacheOptions<T>) {
    this.cache = new Collection();
    this.maxCacheSize = options.maxCacheSize;
    this.getCallback = options.getCallback;
  }

  public update(id: string, data: T): void {
    this.cache.set(id, data);
  }

  public async get(id: string): Promise<T> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    } else {
      const newItem = await this.getCallback(id);
      this.add(id, newItem);
      return newItem;
    }
  }

  public add(id: string, data: T): void {
    if (this.cache.size > this.maxCacheSize) {
      this.cache.delete(this.cache.firstKey());
    }

    this.cache.set(id, data);
  }
}
