import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { InfoEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { getRandomInt } from '../../../utils/Common/Number';

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
      .setMaxValue(1023)
      .setRequired(false)
    )
    .addIntegerOption((option) => option
      .setName(KEY_MAX)
      .setDescription('Максимальноe значение')
      .setMinValue(-1024)
      .setMaxValue(1023)
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
    const max = interaction.options.getInteger(KEY_MAX, false) || 100;
    const digits = interaction.options.getInteger(KEY_DIGITS, false);


    if (digits) {
      let randomInteger = Math.floor(Math.random() * 10 ** 16).toString();

      if (digits >= 16) {
        randomInteger += Math.floor(Math.random() * 10 ** 16).toString();
      }

      randomInteger = randomInteger.slice(0, digits);

      interaction.reply({
        embeds: [
          SuccessEmbed(`Ваше случайное число, состоящие из ${digits} цифр - \`${randomInteger}\``)
        ],
      })
      return;
    }

    if (min >= max) {
      interaction.reply({
        embeds: [
          InfoEmbed('Я достигла комедии. Минимальное число не может быть больше максимального или равняться ему')
        ],
        ephemeral: true,
      });
      return;
    }

    const randomInteger = getRandomInt(min, max);

    interaction.reply({
      embeds: [
        SuccessEmbed(`Ваше случайное число [${min};${max}] - \`${randomInteger}\``)
      ],
    });
  }
}

export default new RollCommand();
