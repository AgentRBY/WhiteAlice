import { DiscordEvent, DiscordEventNames } from '../../structures/Event';
import { ExtendClient } from '../../structures/Client';
import { Collection } from 'discord.js';
import { Activities } from '../../static/Activities';
import { getRandomInt } from '../../utils/Common/Number';
import { sleep } from '../../utils/Common/Strings';
import Logger from '../../utils/Logger';

class Ready extends DiscordEvent<'ready'> {
  name: DiscordEventNames = 'ready';

  async run(client: ExtendClient) {
    await client.guilds.fetch();

    const slashCommands = [...client.slashCommands.values()];
    const commands = [...client.contextCommands.values(), ...slashCommands.map((command) => command.meta.toJSON())];

    if (client.config.environment === 'development' && client.config.devGuildID) {
      const guild = client.guilds.cache.get(client.config.devGuildID);

      if (!guild) {
        Logger.error('Guild not found, commands not registered');
      } else {
        await guild.commands.set(commands);
        Logger.info(`Register ${commands.length} interaction to ${guild.name} guild`);
      }
    } else {
      await client.application.commands.set(commands);
      Logger.info(`Register ${commands.length} interaction to ${client.user.username} application`);
    }

    Logger.success(`${client.user.username} ready`);
    Logger.info(`Working on ${client.guilds.cache.size} guilds`);

    await sleep(1000);

    client.guilds.cache.forEach(async (guild) => {
      if (guild.me.permissions.has('MANAGE_GUILD')) {
        const fetchedInvites = await guild.invites.fetch();
        const codeUses = new Collection<string, number>();
        fetchedInvites.each((invite) => codeUses.set(invite.code, invite.uses));

        client.invites.set(guild.id, codeUses);
      }
    });

    setInterval(() => {
      client.user.setActivity(Activities[getRandomInt(0, Activities.length - 1)]);
    }, 120_000);
  }
}

export default new Ready();
