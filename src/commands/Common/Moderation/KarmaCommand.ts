import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { KARMA_FOR_BAN, KARMA_FOR_MUTE, KARMA_FOR_WARN } from '../../../static/Punishment';
import { getMemberBaseId } from '../../../utils/Other';
import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';

class KarmaCommand extends Command {
  name = 'karma';
  category = 'Moderation';
  aliases = [];
  description = `Показывает карму пользователя
  
  Одна карма = +1% к времени мута.
  За один варн даётся ${KARMA_FOR_WARN} кармы. За один мут - ${KARMA_FOR_MUTE} кармы. За один бан - ${KARMA_FOR_BAN} кармы.`;
  examples: CommandExample[] = [
    {
      description: 'karma @TestUser',
      command: 'Показать карму участника @TestUser',
    },
  ];
  usage = 'karma [пользователь]';

  async run({ client, message }: CommandRunOptions) {
    const member = message.mentions.members.first() || message.member;

    const karma = await client.service.getKarma(getMemberBaseId(member));

    if (!karma) {
      const embed = SuccessEmbed('У вас нет кармы');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const embed = SuccessEmbed(`Ваша карма: ${karma}`);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  }
}

export default new KarmaCommand();
