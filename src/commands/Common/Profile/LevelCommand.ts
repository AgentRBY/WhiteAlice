import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MessageEmbed, Util } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { getMemberFromMessage } from '../../../utils/Discord/Users';
import { getMemberBaseId } from '../../../utils/Other';

class Level extends CommonCommand {
  name = 'level';
  category = 'Profile';
  aliases = ['lvl', 'xp', 'уровень', 'опыт'];
  description = 'Показывает уровень участника';
  examples: CommandExample[] = [
    {
      command: 'level',
      description: 'Показывает ваш уровень',
    },
    {
      command: 'level @Agent_RBY_',
      description: `Показывает уровень участника ${Util.escapeMarkdown('Agent_RBY_')}`,
    },
  ];
  usage = 'level [ник]';

  async run({ message, client }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message) || message.member;

    const profile = await client.service.getMemberProfile(getMemberBaseId(targetMember));

    if (!profile.xp || !profile.level) {
      message.sendError('Уровень не найдено. Попробуйте позже');
      return;
    }

    const timeInVoiceText = profile.timeInVoice ? ` **|** 🎤 ${profile.timeInVoice}` : '';

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setTitle(`${Emojis.Competing} Уровень пользователя ${Util.escapeMarkdown(targetMember.displayName)}`)
      .setDescription(`➤ **Уровень:** ${profile.level} **|** **Опыт:** ${Math.round(profile.xp)}${timeInVoiceText}`);

    message.channel.send({ embeds: [embed] });
  }
}

export default new Level();
