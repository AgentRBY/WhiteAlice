import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Snowflake, VoiceState } from 'discord.js';
import moment from 'moment';
import { getMemberBaseId } from '../../../utils/Other';
import { getRandomInt } from '../../../utils/Common/Number';

const currentInVoice = new Map<Snowflake, Date>();

class VoiceActivity extends DiscordEvent<'voiceStateUpdate'> {
  name: DiscordEventNames = 'voiceStateUpdate';

  run(client: ExtendClient, oldState: VoiceState, newState: VoiceState) {
    if (oldState.channel?.id === newState.channel?.id) {
      return;
    }

    if (oldState.channel?.id && currentInVoice.has(oldState.member?.id)) {
      const timeInVoice = Date.now() - currentInVoice.get(oldState.member.id).getTime();

      const timeInVoiceInMinutes = Math.floor(moment(timeInVoice).unix() / 60);

      if (timeInVoiceInMinutes > 0) {
        const xpToAdd = getRandomInt(2, 5) * timeInVoiceInMinutes;

        client.service.incrementXp(getMemberBaseId(oldState.member), xpToAdd);
      }

      client.service.addTimeInVoice(getMemberBaseId(oldState.member), timeInVoice);

      currentInVoice.delete(oldState.member.id);
    }

    if (newState.channel?.id) {
      currentInVoice.set(newState.member.id, new Date());
    }
  }
}

export default new VoiceActivity();
