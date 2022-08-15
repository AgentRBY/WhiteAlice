import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { Guild, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { client } from '../../../app';
import { SuccessEmbed } from '../../../utils/Discord/Embed';

export class Report extends CommonCommand {
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
    message.delete();

    if (!message.reference) {
      message
        .sendError('Ответь на сообщение, на которое хотите пожаловаться')
        .then((sentMessage) => setTimeout(() => sentMessage.delete(), 2000));
      return;
    }

    const reportedMessage = await message.fetchReference();

    if (reportedMessage.author.bot) {
      message
        .sendError('Нельзя пожаловаться на бота')
        .then((sentMessage) => setTimeout(() => sentMessage.delete(), 2000));
      return;
    }

    if (reportedMessage.author.id === message.author.id) {
      message
        .sendError('Вы не можете пожаловаться сами на себя')
        .then((sentMessage) => setTimeout(() => sentMessage.delete(), 2000));
      return;
    }

    const reason = args.join(' ');

    const moderatorsRoleIds = await client.service.getModerators(message.guild.id);

    if (!moderatorsRoleIds.length) {
      message
        .sendError('Нет ни одной роли модератора на этом сервере')
        .then((sentMessage) => setTimeout(() => sentMessage.delete(), 2000));
      return;
    }

    const moderators = Report.getOnlineModerators(message.guild, moderatorsRoleIds);

    if (!moderators.length) {
      message.sendError('Нет модераторов онлайн').then((sentMessage) => setTimeout(() => sentMessage.delete(), 2000));
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

    const messageEmbed = SuccessEmbed('Ваша жалоба была отправлена');
    message.channel
      .send({ embeds: [messageEmbed] })
      .then((sentMessage) => setTimeout(() => sentMessage.delete(), 1000));
    return;
  }

  public static getOnlineModerators(guild: Guild, moderatorRoleId: Snowflake[]) {
    const presentModerators: GuildMember[] = [];

    moderatorRoleId.forEach((roleId) => {
      const role = guild.roles.cache.get(roleId);

      role.members
        .filter((member) => member.presence && member.presence.status !== 'offline')
        .forEach((member) => presentModerators.push(member));
    });

    return presentModerators;
  }
}

export default new Report();
