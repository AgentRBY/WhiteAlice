import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';

class MuteCommand extends SlashCommand {
  meta = new SlashCommandBuilder().setName('ping').setDescription('Показывает пинг');

  async run({ client, interaction }: SlashCommandRunOptions) {
    const time = new Date();

    const embed = new MessageEmbed()
      .addFields([
        {
          name: '🖥️ До сервера',
          value: `${client.ws.ping}мс`,
          inline: true,
        },
        {
          name: `${Emojis.Discord} До Discord`,
          value: `${time.getMilliseconds() - interaction.createdAt.getMilliseconds()}мс`,
          inline: true,
        },
      ])
      .setColor(Colors.Green)
      .setFooter({
        text: 'Дискорд неверно выдает дату отправления команды, поэтому к задержке До Discord можно добавлять примерно 200мс задержки',
      });

    await interaction.reply({ embeds: [embed] });
  }
}

export default new MuteCommand();
