import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { InfoEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

const KEY_MIN = 'минимум';
const KEY_MAX = 'максимум';
const KEY_DIGITS = 'цифры';

class RollCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Сгенерировать число')
    .addIntegerOption((option) => option
      .setName(KEY_MIN)
      .setDescription('Минимальноe значение')
      .setMinValue(-1024)
      .setMaxValue(1024)
      .setRequired(false)
    )
    .addIntegerOption((option) => option
      .setName(KEY_MAX)
      .setDescription('Максимальноe значение')
      .setMinValue(-1024)
      .setMaxValue(1024)
      .setRequired(false)
    )
    .addIntegerOption((option) => option
      .setName(KEY_DIGITS)
      .setDescription('Количество цифр в числе')
      .setMinValue(1)
      .setMaxValue(32)
      .setRequired(false)
    );

  async run({ interaction }: SlashCommandRunOptions) {
    const min = interaction.options.getInteger(KEY_MIN, false) || 0;
    const max = interaction.options.getInteger(KEY_MAX, false) || 101;
    const digits = interaction.options.getInteger(KEY_DIGITS, false);


    if (digits) {
      let randomIntegerString = Math.floor(Math.random() * 10 ** 16).toString();

      if (digits >= 16) {
        randomIntegerString += Math.floor(Math.random() * 10 ** 16).toString();
      }

      interaction.reply({
        embeds: [
          SuccessEmbed(`Ваше случайное число, состоящие из ${digits} цифр - \`${randomIntegerString.slice(0, digits)}\``)
        ],
        fetchReply: true,
      })
      return;
    }

    if (min >= max - 1) {
      interaction.reply({
        embeds: [
          InfoEmbed('Я достигла комедии. Минимальное число не может быть больше максимального или равняться ему')
        ],
        ephemeral: true,
      });
      return;
    }

    interaction.reply({
      embeds: [
        SuccessEmbed(`Ваше случайное число [${min};${max - 1}] - \`${Math.floor(Math.random() * (max - min) + min)}\``)
      ],
      fetchReply: true,
    });
  }
}

export default new RollCommand();
