import { SuccessEmbed } from '../../../utils/Discord/Embed';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';
import { isSnowflake } from '../../../utils/Discord/Messages';

class UnbanCommand extends CommonCommand {
  name = 'unban';
  category = 'Moderation';
  aliases = ['removeBan'];
  description = 'Разбанивает пользователя, если он был забанен';
  examples: CommandExample[] = [
    {
      command: 'unban 908629905539997726',
      description: 'Разбанивает пользователя с айди 908629905539997726',
    },
    {
      command: 'unban 908629905539997726 Хороший человек',
      description: 'Разбанивает пользователя с айди 908629905539997726 по причине `Хороший человек`',
    },
  ];
  usage = 'unban <айди пользователя> [причина]';
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];
  botPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args }: CommandRunOptions) {
    const userId = args[0];

    if (!userId) {
      message.sendError('Введите айди пользователя');
      return;
    }

    if (!isSnowflake(userId)) {
      message.sendError('Указан неверный айди');
      return;
    }

    const user = await client.users.fetch(userId).catch(() => {});

    if (!user) {
      message.sendError('Пользователь не найден');
      return;
    }

    await message.guild.bans.fetch();
    if (!message.guild.bans.cache.get(user.id)) {
      message.sendError('Пользователь не забанен');
      return;
    }

    const reason = args.slice(1).join(' ');

    message.guild.bans.remove(user.id, reason);

    const embed = SuccessEmbed(`Пользователь ${user} был разбанен`);
    const directEmbed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setDescription(`${Emojis.Info} На сервере \`${message.guild}\` Вас разбанил пользователь ${message.author}`)
      .setTimestamp();

    client.service.removeBan(`${userId}-${message.guild.id}`, message.author.id, reason);

    if (reason) {
      embed.setFooter({ text: `Причина разбана: ${reason}` });
      directEmbed.setFooter({ text: `Причина разбана: ${reason}` });
    }

    user.send({ embeds: [directEmbed] }).catch(() => {});
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new UnbanCommand();
