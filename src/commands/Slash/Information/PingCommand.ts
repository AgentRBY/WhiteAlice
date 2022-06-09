import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../../static/Emojis';
import { Colors } from '../../../static/Colors';

class MuteCommand extends SlashCommand {
  meta = new SlashCommandBuilder().setName('ping').setDescription('Показывает пинг');

  async run({ client, interaction }: SlashCommandRunOptions) {
    const time = new Date();

    const embed = new MessageEmbed()
      .addField('🖥️ До сервера', `${client.ws.ping}мс`, true)
      .addField(
        `${Emojis.Discord} До Discord`,
        `${interaction.createdAt.getMilliseconds() - time.getMilliseconds()}мс`,
        true,
      )
      .setColor(Colors.Green);

    await interaction.reply({ embeds: [embed] });
  }
}

export default new MuteCommand();
