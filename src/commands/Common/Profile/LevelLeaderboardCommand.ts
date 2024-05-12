import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

class LevelLeaderboard extends CommonCommand {
  name = 'levelLeaderboard';
  category = 'Profile';
  aliases = ['llb'];
  description = '';
  examples: CommandExample[] = [];
  usage = 'levelLeaderboard';

  async run({ client, message }: CommandRunOptions) {
    const leaderboard = await client.service.getLeaderboard(message.guildId);

    if (!leaderboard.length) {
      message.sendError('Слишком мало данных для таблицы лидеров, попробуйте позже');
      return;
    }

    const mappedLeaderboard = leaderboard.map((user) => ({
      username: message.guild.members.cache.get(user._id.split('-')[0])?.toString() || '**Unknown user**',
      level: user.profile.level,
    }));

    const description = mappedLeaderboard
      .map((place, index) => `\`${index + 1}.\` ${place.username} - ${place.level} уровень`)
      .join('\n');
    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setTitle(`${Emojis.Competing} Таблица лидеров`)
      .setDescription(description);

    message.channel.send({ embeds: [embed] });
  }
}

export default new LevelLeaderboard();
