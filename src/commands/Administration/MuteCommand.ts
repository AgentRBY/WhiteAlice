import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { formatDuration, getDurationFromString } from '../../utils/Date';
import moment from 'moment';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../static/Emojis';
import { Colors } from '../../static/Colors';

export default new Command({
  name: 'mute',
  category: 'Administration',
  aliases: [],
  description: `Выдаёт мут пользователю.
  Время должно быть записано без пробелов. Поддерживаются дни, часы и минуты.
  
  Поддерживается русский(день, час, минута) и английский(day, hour, minute), а так же укороченные варианты записи времени(д, ч, м или d, h, m).
  
  Имеется ключ -F, который позволяет перезаписать текущее время мута у участника. 
  Т.е. если у пользователя был мут на 5 минут, а вы ему выдали мут с этим ключем на час, то время его мута будет равно часу`,
  examples: [
    {
      command: 'mute @TestUser 1d',
      description: 'Выдаёт мут пользователю @TestUser на 1 день',
    },
    {
      command: 'mute @TestUser 5дней4минуты Плохое поведение',
      description: 'Выдаёт мут пользователю @TestUser на 5 дней и 4 минуты по причине `Плохое поведение`',
    },
    {
      command: 'mute @TestUSer 7d1мин -F',
      description: 'Выдаёт мут пользователю @TestUser на 7 дней и 1 минуту даже если он уже был замучен раньше',
    },
  ],
  usage: 'mute <пользователь> <время> [причина]',
  botPermissions: ['MODERATE_MEMBERS'],
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args, attributes }) => {
    const member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const forceMute = attributes.has('F') || attributes.has('-F');

    if (member.communicationDisabledUntilTimestamp > Date.now() && !forceMute) {
      const duration = Date.now() - member.communicationDisabledUntilTimestamp;

      const embed = ErrorEmbed('Пользователь уже в муте');
      embed.setFooter({
        text: `Осталось до размута: ${moment.duration(duration).locale('ru').humanize()}`,
      });

      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const time = getDurationFromString(args[1]?.toLowerCase());

    if (!time) {
      const embed = ErrorEmbed('Введена неправильная дата');
      embed.setFooter({ text: 'Подробнее о формате даты можно почитать в помощи о команде' });
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const reason = args.slice(2).join(' ');

    await member.timeout(time.asMilliseconds(), reason);

    const formattedTime = formatDuration(time);

    const embed = SuccessEmbed(`Пользователь ${member} был замучен на ${formattedTime}`);
    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${message.author} на ${formattedTime}`,
      )
      .setColor(Colors.Red);

    if (reason) {
      embed.setFooter({ text: `По причине: ${reason}` });
      directEmbed.setFooter({ text: `По причине: ${reason}` });
    }

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    member.send({ embeds: [directEmbed] });
  },
});
