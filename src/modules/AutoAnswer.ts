import { Message } from 'discord.js';
import { ExtendClient } from '../structures/Client';
import { AutoAnswerCommand } from '../commands/Slash/Information/AutoAnswerCommand';

export async function AutoAnswerModule(client: ExtendClient, message: Message) {
  if (!message.content) {
    return;
  }

  const autoAnswers = await client.service.getAutoAnswers(message.guild.id);

  if (!autoAnswers.length) {
    return;
  }

  for (const autoAnswer of autoAnswers) {
    const regex = AutoAnswerCommand.stringToRegex(autoAnswer.triggerRegex);

    if (regex.test(message.content)) {
      message.reply(autoAnswer.answer);
      break;
    }
  }
}
