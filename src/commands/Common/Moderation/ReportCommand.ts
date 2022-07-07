import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { Guild, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';

class Report extends CommonCommand {
  name = 'report';
  category = 'Moderation';
  aliases = [];
  description = 'Пожаловаться на сообщение на которое вы ответили';
  examples: CommandExample[] = [
    {
      command: 'report',
      description: 'Пожаловаться на сообщение на которое вы ответили',
    },
    {
      command: 'report 1.5',
      description: 'Пожаловаться на сообщение на которое вы ответили с причиной 1.5',
    },
  ];
  usage = 'report [причина]';

  async run({ message, args }: CommandRunOptions) {
    if (!message.reference) {
      message.sendError('Ответь на сообщение, на которое хотите пожаловаться');
      return;
    }

    const reportedMessage = await message.fetchReference();

    if (reportedMessage.author.bot) {
      message.sendError('Нельзя пожаловаться на бота');
      return;
    }

    if (reportedMessage.author.id === message.author.id) {
      message.sendError('Вы не можете пожаловаться сами на себя');
      return;
    }

    const reason = args.join(' ');

    // TODO: Change to DB query
    const moderatorRoleId = '748279346258509955';

    const moderators = this.getOnlineModerators(message.guild, moderatorRoleId);

    if (!moderators.size) {
      message.sendError('Нет модераторов онлайн');
      return;
    }

    const embed = new MessageEmbed()
      .setTitle('Жалоба на пользователя')
      .setDescription(
        `Пользователь ${message.author} пожаловался на сообщение пользователя ${reportedMessage.author}
        Содержание сообщения:
        \`\`\`${reportedMessage.content}\`\`\``,
      )
      .setColor(Colors.Blue)
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `Причина жалобы: ${reason}` });
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

    message.sendSuccess('Ваша жалоба была отправлена');
    return;
  }

  private getOnlineModerators(guild: Guild, moderatorRoleId: Snowflake) {
    return guild.roles.cache.get(moderatorRoleId).members.filter((member) => member.presence?.status === 'online');
  }
}

export default new Report();
