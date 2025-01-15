import { SlashCommand, SlashCommandRunOptions } from '../../../structures/Commands/SlashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { isSnowflake } from '../../../utils/Discord/Messages';

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
        .setRequired(false),
    )
    .addStringOption((option) =>
      option.setName('сообщение').setDescription('Айди сообщения, с которого надо начать удаление').setRequired(false),
    );

  async run({ interaction }: SlashCommandRunOptions) {
    if (!interaction.memberPermissions.has('MANAGE_MESSAGES')) {
      const embed = ErrorEmbed('У вас нет прав на эту команду');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const messagesCount = interaction.options.getNumber('количество', false);
    const messageId = interaction.options.getString('сообщение', false);

    if (!messagesCount && !messageId) {
      const embed = ErrorEmbed('Введите количество сообщений или сообщение, с которого начать удаление');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (messagesCount) {
      const messages = await interaction.channel.bulkDelete(messagesCount, true);

      if (!messages.size) {
        const embed = ErrorEmbed('Удалено 0 сообщений');
        embed.setFooter({ text: 'Возможно в канале не осталось сообщений или сообщения старше двух недель' });
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = SuccessEmbed(`Удалено ${messages.size} сообщений`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (messageId) {
      if (!isSnowflake(messageId)) {
        const embed = ErrorEmbed('Неверный айди сообщения');
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const message = await interaction.channel.messages.fetch(messageId);

      if (!message) {
        const embed = ErrorEmbed('Сообщение не найдено');
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const messages = await interaction.channel.messages.fetch({ after: messageId, limit: 100 });

      if (messages.size === 100) {
        const embed = ErrorEmbed('Сообщение слишком далеко, максимум 100 сообщений');
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const deletedMessages = await interaction.channel.bulkDelete(messages.size + 1, true);

      if (!deletedMessages.size) {
        const embed = ErrorEmbed('Удалено 0 сообщений');
        embed.setFooter({ text: 'Возможно в канале не осталось сообщений или сообщения старше двух недель' });
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const embed = SuccessEmbed(`Удалено ${deletedMessages.size + 1} сообщений`);
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
  }
}

export default new ClearCommand();
