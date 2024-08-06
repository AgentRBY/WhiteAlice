import { Snowflake } from 'discord.js';
import { UpdateQuery } from 'mongoose';
import { GuildModel } from '../models/GuildModel';
import { MemberModel } from '../models/MemberModel';
import { CustomVoiceAction } from '../services/GuildServices/CustomVoiceAction';
import { MediaChannelsAction } from '../services/GuildServices/MediaChannelsAction';
import { ModeratorsAction } from '../services/GuildServices/ModeratorsAction';
import { NotesAction } from '../services/GuildServices/NotesAction';
import { PrefixAction } from '../services/GuildServices/PrefixAction';
import { QuoteAction } from '../services/GuildServices/QuoteAction';
import { TestersAction } from '../services/GuildServices/TestersAction';
import { BansAction } from '../services/MemberServices/BansAction';
import { MutesAction } from '../services/MemberServices/MutesAction';
import { ProfileAction } from '../services/MemberServices/ProfileAction';
import { WarnsAction } from '../services/MemberServices/WarnsAction';
import { MongoData } from '../typings/Database';
import { IGuildModel } from '../typings/GuildModel';
import { IMemberModel, MemberBaseId } from '../typings/MemberModel';
import { serviceMixin } from '../utils/Other';
import { ExtendClient } from './Client';
import { TestingAction } from '../services/GuildServices/TestingAction';

export interface Service
  extends PrefixAction,
    TestersAction,
    MediaChannelsAction,
    ProfileAction,
    NotesAction,
    WarnsAction,
    MutesAction,
    BansAction,
    CustomVoiceAction,
    ModeratorsAction,
    QuoteAction,
    TestingAction {}

export class Service extends serviceMixin(
  PrefixAction,
  TestersAction,
  MediaChannelsAction,
  ProfileAction,
  NotesAction,
  WarnsAction,
  MutesAction,
  BansAction,
  CustomVoiceAction,
  ModeratorsAction,
  QuoteAction,
  TestingAction,
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

  private setGuildData(guildId: Snowflake, GuildData: MongoData<IGuildModel>) {
    this.client.guildBase.update(guildId, GuildData);
  }

  private setMemberData(id: MemberBaseId, MemberData: MongoData<IMemberModel>) {
    this.client.memberBase.update(id, MemberData);
  }

  async updateMemberData(id: MemberBaseId, query: UpdateQuery<IMemberModel>) {
    let MemberData: MongoData<IMemberModel>;

    await MemberModel.findByIdAndUpdate(id, query, { new: true }).then((document) => {
      this.setMemberData(id, document);
      MemberData = document;
    });

    return MemberData;
  }

  async updateGuildData(id: Snowflake, query: UpdateQuery<IGuildModel>) {
    let GuildData: MongoData<IGuildModel>;

    await GuildModel.findByIdAndUpdate(id, query, { new: true }).then((document) => {
      this.setGuildData(id, document);
      GuildData = document;
    });

    return GuildData;
  }
}
