import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MessageEmbed, Util } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import dayjs from 'dayjs';

class LevelLeaderboard extends CommonCommand {
  name = 'levelLeaderboard';
  category = 'Profile';
  aliases = ['llb', 'leaderboard', 'lb', 'лидеры'];
  description =
    'Показывает топ 10 участников по уровню. Участники, которых нет на сервере или у которых нет опыта не учитываются';
  examples: CommandExample[] = [
    {
      command: 'levelLeaderboard',
      description: 'Показывает топ 10 участников по уровню',
    },
  ];
  usage = 'levelLeaderboard';

  async run({ client, message }: CommandRunOptions) {
    const leaderboard = await client.service.getLeaderboard(message.guildId);

    if (!leaderboard.length) {
      message.sendError('Слишком мало данных для таблицы лидеров, попробуйте позже');
      return;
    }

    const mappedLeaderboard = leaderboard
      .filter((user) => message.guild.members.cache.has(user._id.split('-')[0]))
      .map((user) => {
        const guildMember = message.guild.members.cache.get(user._id.split('-')[0])!;

        return {
          username: Util.escapeMarkdown(guildMember.displayName),
          level: user.profile.level,
          xp: user.profile.xp,
          timeInVoice: user.profile.timeInVoice > 0 ? dayjs.duration(user.profile.timeInVoice).format('HH:mm:ss') : '',
        };
      });

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setTitle(`${Emojis.Competing} Топ 10 участников по уровню`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFields(
        mappedLeaderboard.map(({ level, username, xp, timeInVoice }, index) => {
          const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
          const timeInVoiceText = timeInVoice ? ` **|** 🎤 ${timeInVoice}` : '';

          return {
            name: `#${index + 1} ${username} ${emoji}`,
            value: `➤ **Уровень:** ${level} **|** **Опыт:** ${Math.round(xp)}${timeInVoiceText}`,
            inline: false,
          };
        }),
      );

    message.channel.send({ embeds: [embed] });
  }
}

export default new LevelLeaderboard();
