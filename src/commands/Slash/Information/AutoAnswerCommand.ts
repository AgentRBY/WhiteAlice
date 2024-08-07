import {
  AutocompleteRunOptions,
  SlashCommand,
  SlashCommandRunOptions,
} from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { Searcher } from 'fast-fuzzy';

export class AutoAnswerCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('auto-answer')
    .setDescription('Настройка авто-ответов')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Добавить авто-ответ на сообщение')
        .addStringOption((option) =>
          option
            .setName('trigger')
            .setDescription(String.raw`RegExp, по которому будет определятся нужное сообщение, пример: /hello/i`)
            .setRequired(true),
        )
        .addStringOption((option) => option.setName('answer').setDescription('Ответное сообщение').setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Удалить авто-ответ')
        .addNumberOption((option) =>
          option.setName('id').setDescription('Айди авто-ответа').setRequired(true).setAutocomplete(true),
        ),
    );

  async run({ interaction, client }: SlashCommandRunOptions) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const embed = ErrorEmbed('Недостаточно прав');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'add') {
      const trigger = interaction.options.getString('trigger', true);
      const answer = interaction.options.getString('answer', true);

      if (!AutoAnswerCommand.isValidRegex(trigger)) {
        const embed = ErrorEmbed('Невалидный регекс');

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      client.service.addAutoAnswer(interaction.guildId, trigger, answer);

      const embed = SuccessEmbed(`Авто-ответ \`${answer}\` для регекса \`${trigger}\` успешно добавлен`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (subcommand === 'remove') {
      const id = interaction.options.getNumber('id', true);

      client.service.removeAutoAnswer(interaction.guildId, id);

      const embed = SuccessEmbed(`Авто-ответ \`№${id}\` успешно удален`);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  async handleAutocomplete({ client, interaction }: AutocompleteRunOptions) {
    const focusedValue = interaction.options.getFocused(true);

    if (focusedValue.name !== 'id') {
      return;
    }

    const autoAnswers = await client.service.getAutoAnswers(interaction.guildId);

    const mappedReports = autoAnswers.map((autoAnswer) => {
      return {
        name: `📄 Авто-ответ №${autoAnswer.id} "${autoAnswer.answer.slice(0, 10)}..." на сообщение формата ${autoAnswer.triggerRegex}`,
        value: String(autoAnswer.id),
      };
    });

    if (focusedValue.value === '') {
      await interaction.respond(mappedReports.slice(0, 25));
      return;
    }

    const searcher = new Searcher(mappedReports, {
      keySelector: (item) => item.name,
    });

    const filteredAutoAnswers = searcher.search(focusedValue.value as string);

    await interaction.respond(filteredAutoAnswers.slice(0, 25));
  }

  public static stringToRegex(text: string) {
    const m = text.match(/^([#%'/;@~])(.*?)\1([gimsuy]*)$/);

    return m ? new RegExp(m[2], m[3]) : new RegExp(text);
  }

  public static isValidRegex(text: string) {
    try {
      this.stringToRegex(text);
      return true;
    } catch {
      return false;
    }
  }
}

export default new AutoAnswerCommand();
