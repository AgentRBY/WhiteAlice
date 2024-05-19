import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getMemberFromMessage } from '../../../utils/Discord/Users';
import { getMemberBaseId } from '../../../utils/Other';
import { MessageEmbed, Util } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

class Coins extends CommonCommand {
  name = 'coins';
  category = 'Profile';
  aliases = [];
  description = '';
  examples: CommandExample[] = [];
  usage = 'coins';

  async run({ message, client }: CommandRunOptions) {
    const targetMember = getMemberFromMessage(message) || message.member;

    const profile = await client.service.getMemberProfile(getMemberBaseId(targetMember));

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setTitle(`${Emojis.Coin} Монетки пользователя ${Util.escapeMarkdown(targetMember.displayName)}`)
      .setDescription(`➤ **Монетки:** ${profile.coins} ${Emojis.Coin}`);

    message.reply({ embeds: [embed], options: { allowedMentions: { repliedUser: false } } });
  }
}

export default new Coins();
