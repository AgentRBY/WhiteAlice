import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import { formatDuration, formatDurationInPast, getDurationFromString } from '../../utils/Date';
import moment from 'moment';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { MemberModel } from '../../models/MemberModel';
import { Mute } from '../../typings/MemberModel';
import { percentToFraction } from '../../utils/Number';
import { MuteType } from '../../static/Mute';

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

    let text: string;
    let directText: string;
    let totalTime: number = time.asMilliseconds();
    let formattedTime = formatDuration(time);
    let muteType = MuteType.CLASSIC;

    if (MemberData.warns.filter((warn) => !warn.removed).length) {
      muteType = MuteType.WITH_WARNS;
    }

    if (MemberData.bans.length) {
      muteType = muteType === MuteType.WITH_WARNS ? MuteType.WITH_WARNS_AND_BANS : MuteType.WITH_BANS;
    }

    switch (muteType) {
      case MuteType.CLASSIC:
        text = `Пользователь ${member} был замучен на ${formattedTime}`;
        directText = `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${message.author} на ${formattedTime}`;
        break;
      case MuteType.WITH_WARNS:
        const warnsInPercent = MemberData.warns.filter((warn) => !warn.removed).length * 5;
        const warnsInFraction = percentToFraction(warnsInPercent);

        totalTime = time.asMilliseconds() * warnsInFraction;
        formattedTime = formatDuration(moment.duration(totalTime));
        const formattedTimeWithWarns = formatDurationInPast(moment.duration(totalTime - time.asMilliseconds()));

        text = `Пользователь ${member} был замучен на ${formattedTime}, из которых ${formattedTimeWithWarns} (+${warnsInPercent}%) он получил из-за предупреждений`;
        directText = `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${message.author} на ${formattedTime}
         Из них ${formattedTimeWithWarns} (+${warnsInPercent}%) Вы получили из-за предупреждений`;
        break;
      case MuteType.WITH_BANS:
        const bansInPercent = MemberData.bans.length * 100;
        const bansInFraction = percentToFraction(bansInPercent);

        totalTime = time.asMilliseconds() * bansInFraction;
        formattedTime = formatDuration(moment.duration(totalTime));
        const formattedTimeWithBans = formatDurationInPast(moment.duration(totalTime - time.asMilliseconds()));

        text = `Пользователь ${member} был замучен на ${formattedTime}, из которых ${formattedTimeWithBans} (+${bansInPercent}%) он получил из-за банов`;
        directText = `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${message.author} на ${formattedTime}
         Из них ${formattedTimeWithBans} (+${bansInPercent}%) Вы получили из-за банов`;
        break;
      case MuteType.WITH_WARNS_AND_BANS:
        const onlyWarnsInPercent = MemberData.warns.filter((warn) => !warn.removed).length * 5;
        const onlyWarnsInFraction = percentToFraction(onlyWarnsInPercent);

        const onlyBansInPercent = MemberData.bans.length * 100;
        const onlyBansInFraction = percentToFraction(onlyBansInPercent);

        const bansAndWarnsInFraction = percentToFraction(onlyBansInPercent + onlyWarnsInPercent);

        totalTime = time.asMilliseconds() * bansAndWarnsInFraction;
        formattedTime = formatDuration(moment.duration(totalTime));

        const formattedTimeWithOnlyWarns = formatDurationInPast(
          moment.duration(totalTime - time.asMilliseconds() * onlyBansInFraction),
        );
        const formattedTimeWithOnlyBans = formatDurationInPast(
          moment.duration(totalTime - time.asMilliseconds() * onlyWarnsInFraction),
        );

        text = `Пользователь ${member} был замучен на ${formattedTime}, из которых ${formattedTimeWithOnlyWarns} (+${onlyWarnsInPercent}%) он получил из-за предупреждений, а ${formattedTimeWithOnlyBans} (+${onlyBansInPercent}%) он получил из-за банов`;
        directText = `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${message.author} на ${formattedTime}
         Из них ${formattedTimeWithOnlyWarns} (+${onlyWarnsInPercent}%) Вы получили из-за предупреждений
         И ${formattedTimeWithOnlyBans} (+${onlyBansInPercent}%) из-за банов`;
        break;
    }

    const embed = SuccessEmbed(text);
    const directEmbed = new MessageEmbed().setDescription(directText).setColor(Colors.Red).setTimestamp();

    if (reason) {
      embed.setFooter({ text: `По причине: ${reason}` });
      directEmbed.setFooter({ text: `По причине: ${reason}` });
    }

    await member.timeout(totalTime, reason);

    const mute: Mute = {
      date: Date.now(),
      reason: reason,
      givenBy: message.author.id,
      time: totalTime,
    };

    MemberData.mutes.push(mute);
    MemberData.save();

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    member.send({ embeds: [directEmbed] });
  },
});
