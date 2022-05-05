import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { formatDuration, formatDurationInPast, getDurationFromString } from '../../utils/Date';
import moment from 'moment';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { MemberModel } from '../../models/MemberModel';
import { Mute } from '../../typings/MemberModel';

export default new Command({
  name: 'mute',
  category: 'Moderation',
  aliases: [],
  description: `Выдаёт мут пользователю.
  Время должно быть записано без пробелов. Поддерживаются дни, часы и минуты.
  
  Поддерживается русский(день, час, минута) и английский(day, hour, minute), а так же укороченные варианты записи времени(д, ч, м или d, h, m).
  
  Имеется ключ -F, который позволяет перезаписать текущее время мута у участника. 
  Т.е. если у пользователя был мут на 5 минут, а вы ему выдали мут с этим ключем на час, то время его мута будет равно часу
  
  Список всех мутов у пользователя можно посмотреть командой >mutes`,
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
      description: 'Выдаёт мут пользователю @TestUser на 7 дней и 1 минуту, даже если он уже был замучен раньше',
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

    if (
      member.permissions.has('BAN_MEMBERS') ||
      member.permissions.has('MODERATE_MEMBERS') ||
      member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0
    ) {
      const embed = ErrorEmbed('У вас нет прав, что бы замутить этого пользователя');
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

    const MemberData = await MemberModel.findById(`${member.id}-${message.guildId}`);

    const reason = args.slice(2).join(' ');

    const warnsInPercent = (MemberData.warns.length * 5) / 100 + 1;
    const timeWitchWarns = time.asMilliseconds() * warnsInPercent;

    await member.timeout(timeWitchWarns, reason);

    const formattedTime = formatDuration(moment.duration(timeWitchWarns));
    const formattedTimeWhichWarns = formatDurationInPast(moment.duration(timeWitchWarns - time.asMilliseconds()));

    const embed = SuccessEmbed(
      !MemberData.warns.length
        ? `Пользователь ${member} был замучен на ${formattedTime}`
        : `Пользователь ${member} был замучен на ${formattedTime}, из которых ${formattedTimeWhichWarns} (+${
            MemberData.warns.length * 5
          }%) он получил из-за предупреждений`,
    );
    const directEmbed = new MessageEmbed()
      .setDescription(
        !MemberData.warns.length
          ? `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${message.author} на ${formattedTime}`
          : `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${
              message.author
            } на ${formattedTime}
            Из них ${formattedTimeWhichWarns} (+${MemberData.warns.length * 5}%) вы получили из-за предупреждений`,
      )
      .setColor(Colors.Red)
      .setTimestamp();

    if (reason) {
      embed.setFooter({ text: `По причине: ${reason}` });
      directEmbed.setFooter({ text: `По причине: ${reason}` });
    }

    const mute: Mute = {
      date: Date.now(),
      reason: reason,
      givenBy: message.author.id,
      time: Math.floor(timeWitchWarns),
    };

    MemberData.mutes.push(mute);
    MemberData.save();

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    member.send({ embeds: [directEmbed] });
  },
});
