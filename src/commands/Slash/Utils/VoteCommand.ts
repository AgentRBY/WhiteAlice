import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed } from '../../../utils/Discord/Embed';
import { Message, MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';

class VoteCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Создать голосование')
    .addStringOption((option) =>
      option.setName('опции').setDescription('Введите доступные опции через запятую').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('вопрос').setDescription('Введите вопрос').setRequired(false),
    );

  async run({ interaction }: SlashCommandRunOptions) {
    const options = interaction.options.getString('опции', true).split(',');
    const question = interaction.options.getString('вопрос', false);

    if (options.length < 2) {
      const embed = ErrorEmbed('Введите две или больше опции через запятую');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (options.length > 10) {
      const embed = ErrorEmbed('Максимально может быть 10 опций');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new MessageEmbed()
      .setTitle(question || 'Голосование')
      .setColor(Colors.Blue)
      .addFields(
        options.map((option, index) => ({
          name: `Вариант №${index + 1}`,
          value: option,
        })),
      );

    interaction.reply({ embeds: [embed], fetchReply: true }).then((message) => {
      if (!(message instanceof Message)) {
        return;
      }

      const reactions = {
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
        10: '🔟',
      };

      options.forEach((_, index) => {
        message.react(reactions[index + 1]);
      });
    });
  }
}

export default new VoteCommand();
