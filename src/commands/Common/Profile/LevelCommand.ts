import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { MessageEmbed, Util } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { getMemberFromMessage } from '../../../utils/Discord/Users';
import { getMemberBaseId } from '../../../utils/Other';

class Level extends CommonCommand {
  name = 'level';
  category = 'Profile';
  aliases = [];
  description = 'Показывает уровень участника';
  examples: CommandExample[] = [];
  usage = 'level [ник]';

  async run({ message, client }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message) || message.member;

    const level = await client.service.getCurrentLevel(getMemberBaseId(targetMember));
    const xp = await client.service.getCurrentXp(getMemberBaseId(targetMember));

    if (!level || !xp) {
      message.sendError('Уровень не найдено. Попробуйте позже');
      return;
    }

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setTitle(`${Emojis.Competing} Пользователь ${Util.escapeMarkdown(targetMember.displayName)}`)
      .setDescription(`Уровень: ${level} (${Math.round(xp)} опыта)`);

    message.channel.send({ embeds: [embed] });
  }
}

export default new Level();
