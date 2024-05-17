import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Awaitable, GuildMember, Snowflake, VoiceState } from 'discord.js';
import moment from 'moment';
import { getMemberBaseId } from '../../../utils/Other';
import { getRandomInt } from '../../../utils/Common/Number';

const currentInVoice = new Map<Snowflake, Date>();

class VoiceActivity extends DiscordEvent<'voiceStateUpdate'> {
  name: DiscordEventNames = 'voiceStateUpdate';

  private recalculateMemberVoiceTime(member: GuildMember, client: ExtendClient) {
    const timeInVoice = Date.now() - currentInVoice.get(member.id).getTime();

    const timeInVoiceInMinutes = Math.floor(moment(timeInVoice).unix() / 60);

    if (timeInVoiceInMinutes > 0) {
      const xpToAdd = getRandomInt(2, 5) * timeInVoiceInMinutes;

      client.service.incrementXp(getMemberBaseId(member), xpToAdd);
    }

    client.service.addTimeInVoice(getMemberBaseId(member), timeInVoice);

    currentInVoice.delete(member.id);
  }

  run(client: ExtendClient, oldState: VoiceState, newState: VoiceState) {
    if (oldState.channel?.id === newState.channel?.id) {
      return;
    }

    if (oldState.channel?.id && currentInVoice.has(oldState.member?.id)) {
      this.recalculateMemberVoiceTime(oldState.member, client);
    }

    if (newState.channel?.id) {
      currentInVoice.set(newState.member.id, new Date());
    }
  }

  onInit(client: ExtendClient): Awaitable<void> {
    client.guilds.cache.forEach((guild) => {
      guild.members.cache.forEach((member) => {
        if (member.voice.channel) {
          currentInVoice.set(member.id, new Date());
        }
      });
    });
  }

  onExit(client: ExtendClient): Awaitable<void> {
    client.guilds.cache.forEach((guild) => {
      guild.members.cache.forEach((member) => {
        if (member.voice.channel) {
          this.recalculateMemberVoiceTime(member, client);
        }
      });
    });
  }
}

export default new VoiceActivity();
