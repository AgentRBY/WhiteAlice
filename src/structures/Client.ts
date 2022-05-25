import { Client, ClientEvents, Collection, Intents } from 'discord.js';
import { promisify } from 'util';
import { glob } from 'glob';
import { CommandType } from '../typings/Command';
import { EventType } from '../typings/Event';
import { DisTube, DisTubeEvents } from 'distube';
import SoundCloudPlugin from '@distube/soundcloud';
import SpotifyPlugin from '@distube/spotify';
import AniDB from 'anidbjs';
import mongoose from 'mongoose';
import { MongoData } from '../typings/Database';
import { IMemberModel } from '../typings/MemberModel';
import { CacheManager } from './CacheManager';
import { IGuildModel } from '../typings/GuildModel';
import { MemberModel } from '../models/MemberModel';
import { GuildModel } from '../models/GuildModel';
import { Service } from './Service';
import Logger from '../utils/Logger';

const globPromise = promisify(glob);

export class ExtendClient extends Client {
  commands: Collection<string, CommandType> = new Collection();
  categories: Set<string> = new Set();
  aliases: Collection<string, string> = new Collection();
  disTube: DisTube;
  aniDB = new AniDB({ client: 'hltesttwo', version: 9 });
  config = process.env;
  invites: Collection<string, Collection<string, number>> = new Collection();
  memberBase: CacheManager<MongoData<IMemberModel>>;
  guildBase: CacheManager<MongoData<IGuildModel>>;
  service: Service;

  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
    });
  }

  async start(): Promise<void> {
    this.disTube = new DisTube(this, {
      searchSongs: 1,
      searchCooldown: 30,
      emptyCooldown: 20,
      leaveOnFinish: true,
      plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
      youtubeCookie: this.config.distubeCookie,
      youtubeDL: false,
      nsfw: true,
      ytdlOptions: {
        quality: 'highestvideo',
      },
    });

    await mongoose.connect(process.env.mongoURI).catch((error) => Logger.error(error));

    this.service = new Service(this);

    await this.loadCommands();
    await this.loadEvents();

    this.memberBase = new CacheManager({
      maxCacheSize: 100,
      getCallback: this.getMemberBase,
    });
    this.guildBase = new CacheManager({
      maxCacheSize: 100,
      getCallback: this.getGuildBase,
    });

    await this.login(process.env.botToken);
  }

  public getOwners(): string[] {
    return this.config.ownersID?.split(',') || [];
  }

  private static async importFile(filePath: string) {
    const { default: file } = await import(filePath);
    return file;
  }

  private async loadCommands() {
    const commandFiles = await globPromise(`${__dirname}/../commands/**/*.{js,ts}`);

    commandFiles.map(async (commandFile: string) => {
      const file: CommandType = await ExtendClient.importFile(commandFile);

      if (file.name) {
        this.commands.set(file.name.toLowerCase(), file);
        this.categories.add(file.category.toLowerCase());

        if (file.aliases?.length) {
          file.aliases.map((alias: string) => this.aliases.set(alias.toLowerCase(), file.name.toLowerCase()));
        }
      }
    });
  }

  private async loadEvents() {
    const eventFiles = await globPromise(`${__dirname}/../events/**/*.{js,ts}`);

    for (const eventFile of eventFiles) {
      const event: EventType = await ExtendClient.importFile(eventFile);

      if (event.name) {
        if (event.type === 'distube') {
          this.disTube.on(event.name as keyof DisTubeEvents, event.run);
          continue;
        }

        this.on(event.name as keyof ClientEvents, event.run.bind(null, this));
      }
    }
  }

  protected async getMemberBase(id: string): Promise<MongoData<IMemberModel>> {
    let MemberData = await MemberModel.findById(id);

    if (!MemberData) {
      MemberData = await MemberModel.create({
        _id: id,
      });

      await MemberData.save();
    }

    return MemberData;
  }

  protected async getGuildBase(id: string): Promise<MongoData<IGuildModel>> {
    let GuildData = await GuildModel.findById(id);

    if (!GuildData) {
      GuildData = await GuildModel.create({
        _id: id,
        prefix: this.config.prefix || '>',
      });

      await GuildData.save();
    }

    return GuildData;
  }
}
