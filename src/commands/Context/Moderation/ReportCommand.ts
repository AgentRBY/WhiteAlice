import { ContextCommand, ContextCommandRun, ContextCommandType } from '../../../structures/Commands/ContextCommand';
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { Report } from '../../Common/Moderation/ReportCommand';
import { client } from '../../../app';
import { isImageLink } from '../../../utils/Common/Strings';

class ReportCommand extends ContextCommand {
  name = 'Пожаловаться';
  type: ContextCommandType = 'MESSAGE';

  async run({ interaction }: ContextCommandRun<'MESSAGE'>) {
    const reportedMessage = interaction.targetMessage;
    if (!(reportedMessage instanceof Message)) {
      const embed = ErrorEmbed('Ошибка');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (reportedMessage.author.bot) {
      const embed = ErrorEmbed('Нельзя пожаловаться на бота');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (reportedMessage.author.id === interaction.user.id) {
      const embed = ErrorEmbed('Вы не можете пожаловаться на самого себя');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const moderatorsRoleIds = await client.service.getModerators(interaction.guild.id);

    const moderators = Report.getOnlineModerators(interaction.guild, moderatorsRoleIds);

    if (!moderators.length) {
      const embed = ErrorEmbed('Нет модераторов онлайн');
      interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const embed = new MessageEmbed()
      .setTitle('Жалоба на пользователя')
      .setDescription(
        `Пользователь ${interaction.user} пожаловался на сообщение пользователя ${reportedMessage.author}
        Содержение сообщения:
        ${!reportedMessage.content.includes('```') ? `> ${reportedMessage.content}` : ''}`,
      )
      .setColor(Colors.Blue)
      .setTimestamp();

    if (reportedMessage.attachments.size && isImageLink(reportedMessage.attachments.first().url)) {
      embed.setImage(reportedMessage.attachments.first().url);
    }

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Удалить сообщение')
        .setEmoji(Emojis.Remove)
        .setCustomId(`report-delete-${reportedMessage.guildId}-${reportedMessage.id}`)
        .setStyle('PRIMARY'),
      new MessageButton()
        .setLabel('Забанить участника')
        .setEmoji(Emojis.No)
        .setCustomId(`report-ban-${reportedMessage.guildId}-${reportedMessage.author.id}`)
        .setStyle('DANGER'),
      new MessageButton().setLabel('Перейти к сообщению').setEmoji('🔗').setStyle('LINK').setURL(reportedMessage.url),
    );

    moderators.forEach((moderator) => {
      moderator.send({ embeds: [embed], components: [buttons] });
    });

    const successEmbed = SuccessEmbed('Жалоба отправлена');
    interaction.reply({ embeds: [successEmbed], ephemeral: true });
    return;
  }
}

export default new ReportCommand();
