import { Interaction, MessageEmbed, Role } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { ExtendClient } from '../../../structures/Client';
import { DiscordEvent, DiscordEventNames } from '../../../structures/Event';
import { RoleSelect } from '../../../typings/Interactions';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class SelectRoleEvent extends DiscordEvent<'interactionCreate'> {
  name: DiscordEventNames = 'interactionCreate';

  async run(client: ExtendClient, interaction: Interaction) {
    if (!interaction.inCachedGuild()) {
      return;
    }

    if (!interaction.isSelectMenu()) {
      return;
    }

    if (!interaction.customId.startsWith(RoleSelect.SelectRole)) {
      return;
    }

    if (interaction.values.includes('default')) {
      const embed = SuccessEmbed('Что бы добавить роль выполните команду /role add');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    const allRolesIdInSelect = new Set(interaction.component.options.map((option) => option.value));
    const userRoles = interaction.member.roles.cache.filter((role) => allRolesIdInSelect.has(role.id));

    const rolesToAdd: Role[] = [];
    const rolesToRemove: Role[] = [];

    for (const roleId of allRolesIdInSelect) {
      const role = interaction.guild.roles.cache.get(roleId);

      if (interaction.values.includes(role.id)) {
        if (!userRoles.has(role.id)) {
          rolesToAdd.push(role);
        }
      } else {
        if (userRoles.has(role.id)) {
          rolesToRemove.push(role);
        }
      }
    }

    if (!rolesToAdd.length && !rolesToRemove.length) {
      const embed = ErrorEmbed('Роли не обновлены, попробуйте ещё раз');
      interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    await interaction.member.roles.add(rolesToAdd);
    await interaction.member.roles.remove(rolesToRemove);

    const formattedAddedRoles = `\`${rolesToAdd.map((role) => role.name).join('`, `')}\``;
    const formattedRemovedRoles = `\`${rolesToRemove.map((role) => role.name).join('`, `')}\``;

    const embed = new MessageEmbed().setColor(Colors.Blue);

    if (rolesToAdd.length) {
      embed.addFields({
        name: `${Emojis.Add} Добавленные роли`,
        value: formattedAddedRoles,
        inline: true,
      });
    }

    if (rolesToRemove.length) {
      embed.addFields({
        name: `${Emojis.Remove} Удалённые роли`,
        value: formattedRemovedRoles,
        inline: true,
      });
    }

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
}

export default new SelectRoleEvent();
