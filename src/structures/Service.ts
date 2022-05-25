import { ExtendClient } from './Client';
import { PrefixAction } from '../services/GuildServices/PrefixAction';
import { TestersAction } from '../services/GuildServices/TestersAction';
import { IGuildModel } from '../typings/GuildModel';
import { MongoData } from '../typings/Database';
import { IMemberModel, MemberBaseId } from '../typings/MemberModel';
import { MediaChannelsAction } from '../services/GuildServices/MediaChannelsAction';
import { ProfileAction } from '../services/MemberServices/ProfileAction';
import { Snowflake } from 'discord.js';
import { NotesAction } from '../services/GuildServices/NotesAction';
import { WarnsAction } from '../services/MemberServices/WarnsAction';
import { MutesAction } from '../services/MemberServices/MutesAction';
import { BansAction } from '../services/MemberServices/BansAction';
import { serviceMixin } from '../utils/Other';

export interface Service
  extends PrefixAction,
    TestersAction,
    MediaChannelsAction,
    ProfileAction,
    NotesAction,
    WarnsAction,
    MutesAction,
    BansAction {}

export class Service extends serviceMixin(
  PrefixAction,
  TestersAction,
  MediaChannelsAction,
  ProfileAction,
  NotesAction,
  WarnsAction,
  MutesAction,
  BansAction,
) {
  client: ExtendClient;

  constructor(client: ExtendClient) {
    super();
    this.client = client;
  }

  getGuildData(guildId: Snowflake): Promise<MongoData<IGuildModel>> {
    return this.client.guildBase.get(guildId);
  }

  getMemberData(id: MemberBaseId): Promise<MongoData<IMemberModel>> {
    return this.client.memberBase.get(id);
  }

  async setGuildData(guildId: Snowflake, GuildData: MongoData<IGuildModel>): Promise<void> {
    await this.client.guildBase.update(guildId, GuildData).save();
  }

  async setMemberData(id: MemberBaseId, MemberData: MongoData<IMemberModel>): Promise<void> {
    await this.client.memberBase.update(id, MemberData).save();
  }
}
