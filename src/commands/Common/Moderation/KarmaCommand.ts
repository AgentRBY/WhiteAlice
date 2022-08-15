import { KARMA_FOR_BAN, KARMA_FOR_MUTE, KARMA_FOR_WARN } from '../../../static/Punishment';
import { getMemberBaseId } from '../../../utils/Other';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { getMemberFromMessage } from '../../../utils/Discord/Users';

class KarmaCommand extends CommonCommand {
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

  async run({ client, message, args }: CommandRunOptions) {
    const potentialMember = getMemberFromMessage(message);

    if (args.length && !potentialMember) {
      message.sendError('Пользователь не найден');
      return;
    }

    const member = potentialMember || message.member;

    const karma = await client.service.getKarma(getMemberBaseId(member));

    if (!karma) {
      message.sendSuccess(`У пользователя ${member} нет кармы`);
      return;
    }

    message.sendSuccess(`Карма пользователя ${member}: ${karma}`);
    return;
  }
}

export default new KarmaCommand();
