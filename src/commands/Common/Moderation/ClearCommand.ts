import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed, PermissionString } from 'discord.js';
import plural from 'plural-ru';
import { Colors } from '../../../static/Colors';
import { EmojisLinks } from '../../../static/Emojis';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { isNumber } from '../../../utils/Common/Number';

class Clear extends CommonCommand {
  name = 'clear';
  category = 'Moderation';
  aliases = ['purge', 'c'];
  description = 'Удаляет сообщения в текущем чате. Можно указать количество сообщений для удаления от 1 до 1000';
  examples: CommandExample[] = [];
  usage = 'clear <количество>';
  botPermissions: PermissionString[] = ['MANAGE_MESSAGES'];
  memberPermissions: PermissionString[] = ['MANAGE_MESSAGES'];

  async run({ message, args }: CommandRunOptions) {
    const amount = Number.parseInt(args[0]);

    if (!amount) {
      message.sendError('Укажите количество сообщений для удаления');
      return;
    }

    if (!isNumber(amount)) {
      message.sendError('Некорректное количество сообщений для удаления');
      return;
    }

    if (amount < 1 || amount > 1000) {
      message.sendError('Количество сообщений для удаления должно быть от 1 до 1000');
      return;
    }

    if (!message.channel.isText() || message.channel.type === 'DM') {
      return;
    }

    const MAX_AMOUNT_PER_REQUEST = 100;

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Очистка чата...', iconURL: EmojisLinks.Moderation })
      .setColor(Colors.Blue)
      .setDescription('Удаление сообщений: 0%');

    const removeOriginalMessage = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('clear_removeOriginalMessage')
        .setLabel('Удалить это и оригинальное сообщение')
        .setStyle('DANGER')
        .setDisabled(true),
    );

    const responseMessage = await message.reply({ embeds: [embed], components: [removeOriginalMessage] });

    let deletedMessagesAmount = 0;
    let deletedAmountPercent = 0;

    for (let index = 0; index < amount; index += MAX_AMOUNT_PER_REQUEST) {
      const amountLeft = amount - index;
      const amountToDelete = amountLeft > MAX_AMOUNT_PER_REQUEST ? MAX_AMOUNT_PER_REQUEST : amountLeft;

      const messages = await message.channel.messages.fetch({ limit: amountToDelete, before: message.id });

      if (messages.size === 0) {
        break;
      }

      const deletedMessages = await message.channel.bulkDelete(messages, true);

      deletedMessagesAmount += deletedMessages.size;

      if (amountToDelete === 1) {
        deletedMessagesAmount += 1; // Discord.js has bug, when bulkDelete returns 0, when you try to delete 1 message
      }

      if (deletedMessages.size === 0 && amountToDelete !== 1) {
        break;
      }

      deletedAmountPercent += (amountToDelete / amount) * 100;

      embed.setDescription(`Удаление сообщений: ${deletedAmountPercent.toFixed(0)}%`);
      responseMessage.edit({ embeds: [embed] }).catch(() => {});
    }

    embed
      .setDescription(`Было удалено ${plural(deletedMessagesAmount, '%d сообщение', '%d сообщения', '%d сообщений')}`)
      .setAuthor({ name: 'Очистка чата завершена', iconURL: EmojisLinks.Moderation })
      .setColor(Colors.Green);

    removeOriginalMessage.components[0].setDisabled(false);

    responseMessage.edit({ embeds: [embed], components: [removeOriginalMessage] }).catch(() => {});

    const collector = responseMessage.createMessageComponentCollector({
      filter: (interaction: ButtonInteraction) => interaction.customId === 'clear_removeOriginalMessage',
      idle: 60_000,
      max: 1,
    });

    collector.on('collect', (interaction: ButtonInteraction) => {
      try {
        message.delete();
        responseMessage.delete();
      } finally {
        interaction.deferUpdate();
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'messageDelete') {
        return;
      }

      removeOriginalMessage.components[0].setDisabled(true);
      responseMessage.edit({ embeds: [embed], components: [removeOriginalMessage] });
    });
  }
}

export default new Clear();
