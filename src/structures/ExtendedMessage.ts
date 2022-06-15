import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { insertMethods } from '../utils/Other';
import { Emojis } from '../static/Emojis';
import { Colors } from '../static/Colors';

export class ExtendedMessage {
  public static getInstance(message: Message): ExtendedMessage & Message {
    return insertMethods(message, ExtendedMessage);
  }

  public async sendSuccess(this: Message, content: string, options?: MessageEmbedOptions) {
    const embed = new MessageEmbed({
      description: `${Emojis.Yes} ${content}`,
      color: Colors.Green,
      ...options,
    });
    return await this.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }

  public async sendError(this: Message, content: string, options?: MessageEmbedOptions) {
    const embed = new MessageEmbed({
      description: `${Emojis.No} ${content}`,
      color: Colors.Red,
      ...options,
    });
    return await this.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}
