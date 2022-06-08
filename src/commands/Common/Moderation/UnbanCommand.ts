import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
import { isSnowflake } from 'distube';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { Emojis } from '../../../static/Emojis';
import { Command, CommandExample, CommandRunOptions } from '../../../structures/Command';

class UnbanCommand extends Command {
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
      const embed = ErrorEmbed('Введите айди пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!isSnowflake(userId)) {
      const embed = ErrorEmbed('Указан неверный айди');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const user = await client.users.fetch(userId).catch(() => {});

    if (!user) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    await message.guild.bans.fetch();
    if (!message.guild.bans.cache.get(user.id)) {
      const embed = ErrorEmbed('Пользователь не забанен');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
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
