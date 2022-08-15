import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';

class ClearCommand extends SlashCommand {
  meta = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Очистить сообщения в чате')
    .addNumberOption((option) =>
      option
        .setName('количество')
        .setDescription('Количество сообщений, которые нужно удалить')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    );

  async run({ interaction }: SlashCommandRunOptions) {
    if (!interaction.memberPermissions.has('MANAGE_MESSAGES')) {
      const embed = ErrorEmbed('У вас нет прав на эту команду');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const messagesCount = interaction.options.getNumber('количество', true);

    const messages = await interaction.channel.bulkDelete(messagesCount, true);

    if (!messages.size) {
      const embed = ErrorEmbed('Удалено 0 сообщений');
      embed.setFooter({ text: 'Возможно в канале не осталось сообщений или сообщения старше двух недель' });
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = SuccessEmbed(`Удалено ${messages.size} сообщений`);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

export default new ClearCommand();
