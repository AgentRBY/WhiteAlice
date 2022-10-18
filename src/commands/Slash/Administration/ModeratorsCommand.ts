import {
  AutocompleteRunOptions,
  SlashCommand,
  SlashCommandRunOptions,
} from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { Searcher } from 'fast-fuzzy';

class ModeratorsCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('moderator')
    .setDescription('Управление модераторами')
    .addSubcommand((option) =>
      option
        .setName('add')
        .setDescription('Добавить роль модератора в базу')
        .addRoleOption((option) =>
          option
            .setName('роль')
            .setRequired(true)
            .setDescription('Роль, которую вы хотите добавить в список ролей модераторов'),
        ),
    )
    .addSubcommand((option) =>
      option
        .setName('remove')
        .setDescription('Удалить роль модератора из базы')
        .addStringOption((option) =>
          option
            .setName('роль')
            .setRequired(true)
            .setDescription('Роль, которую вы хотите удалить из списока ролей модераторов')
            .setAutocomplete(true),
        ),
    );

  async run(options: SlashCommandRunOptions) {
    if (!options.interaction.member.permissions.has('ADMINISTRATOR')) {
      const embed = ErrorEmbed('Недостаточно прав');
      return options.interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const subcommand = options.interaction.options.getSubcommand();

    switch (subcommand) {
      case 'add': {
        return this.runAddRole(options);
      }
      case 'remove': {
        return this.runRemoveRole(options);
      }
    }
  }

  private async runAddRole({ client, interaction }: SlashCommandRunOptions) {
    const role = interaction.options.getRole('роль');

    if (await client.service.isModeratorExist(interaction.guild.id, role.id)) {
      const embed = ErrorEmbed(`Роль ${role} уже есть в списке модераторов`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    await client.service.addModerator(interaction.guild.id, role.id);
    const embed = SuccessEmbed(`Роль ${role} добавлена в список модераторов`);
    return interaction.reply({ embeds: [embed] });
  }

  private async runRemoveRole({ client, interaction }: SlashCommandRunOptions) {
    const roleId = interaction.options.getString('роль');
    const role = interaction.guild.roles.cache.get(roleId);

    await client.service.removeModerator(interaction.guild.id, roleId);

    const embed = SuccessEmbed(`Роль ${role} удалена из списка модераторов`);
    return interaction.reply({ embeds: [embed] });
  }

  async handleAutocomplete({ client, interaction }: AutocompleteRunOptions) {
    const focusedValue = interaction.options.getFocused(true);

    if (focusedValue.name !== 'роль') {
      return;
    }

    const moderators = await client.service.getModerators(interaction.guild.id);

    if (!moderators.length) {
      await interaction.respond([]);
      return;
    }

    const mappedModerators = moderators.map((moderator) => {
      const role = interaction.guild.roles.cache.get(moderator);

      return {
        name: `@${role.name}`,
        value: moderator,
      };
    });

    if (focusedValue.value === '') {
      await interaction.respond(mappedModerators.slice(0, 25));
      return;
    }

    const searcher = new Searcher(mappedModerators, {
      keySelector: (item) => item.name,
    });

    const filteredBans = searcher.search(focusedValue.value as string);

    await interaction.respond(filteredBans.slice(0, 25));
  }
}

export default new ModeratorsCommand();
