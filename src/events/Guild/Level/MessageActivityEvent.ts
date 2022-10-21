import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { ExtendClient } from '../../../structures/Client';
import { Message, Snowflake } from 'discord.js';
import { getMemberBaseId } from '../../../utils/Other';
import { getRandomInt } from '../../../utils/Common/Number';

const talkedRecently = new Set<Snowflake>();

class MessageActivity extends DiscordEvent<'messageCreate'> {
  name: DiscordEventNames = 'messageCreate';

  async run(client: ExtendClient, message: Message) {
    if (!message.member || !message.guild || !message.guild.me || message.channel.type === 'DM' || message.system) {
      return;
    }

    if (message.author.bot) {
      return;
    }

    if (talkedRecently.has(message.author.id)) {
      return;
    }

    await client.service.migrateLevel(getMemberBaseId(message.member));

    talkedRecently.add(message.author.id);

    const xpToAdd = getRandomInt(10, 25);
    await client.service.incrementXp(getMemberBaseId(message.member), xpToAdd);

    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 60_000);

    const currentLevel = await client.service.getCurrentLevel(getMemberBaseId(message.member));
    const currentXp = await client.service.getCurrentXp(getMemberBaseId(message.member));
    const nextLevelXp = client.service.getXpByLevel(currentLevel + 1);

    if (currentXp > nextLevelXp) {
      await client.service.incrementLevel(getMemberBaseId(message.member));
    }
  }
}

export default new MessageActivity();
