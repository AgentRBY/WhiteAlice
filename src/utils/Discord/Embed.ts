import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';

export const ErrorEmbed = (description: string): MessageEmbed =>
  new MessageEmbed().setDescription(`${Emojis.No} ${description}`).setColor(Colors.Red);

export const InfoEmbed = (description: string): MessageEmbed =>
  new MessageEmbed().setDescription(`${Emojis.Info} ${description}`).setColor(Colors.Blue);

export const SuccessEmbed = (description: string): MessageEmbed =>
  new MessageEmbed().setDescription(`${Emojis.Yes} ${description}`).setColor(Colors.Green);
