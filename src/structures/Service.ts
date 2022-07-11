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
import { CustomVoiceAction } from '../services/GuildServices/CustomVoiceAction';
import { UpdateQuery } from 'mongoose';
import { MemberModel } from '../models/MemberModel';

export interface Service
  extends PrefixAction,
    TestersAction,
    MediaChannelsAction,
    ProfileAction,
    NotesAction,
    WarnsAction,
    MutesAction,
    BansAction,
    CustomVoiceAction {}

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

  setGuildData(guildId: Snowflake, GuildData: MongoData<IGuildModel>) {
    this.client.guildBase.update(guildId, GuildData);
  }

  setMemberData(id: MemberBaseId, MemberData: MongoData<IMemberModel>) {
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
}
