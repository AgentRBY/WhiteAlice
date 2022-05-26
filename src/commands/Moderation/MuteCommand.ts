import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';
import { formatDuration, formatDurationInPast, getDurationFromString } from '../../utils/Common/Date';
import moment from 'moment';
import { MessageEmbed, PermissionString } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { KARMA_FOR_MUTE } from '../../static/Punishment';
import { getMemberBaseId } from '../../utils/Other';
import { Mute } from '../../typings/MemberModel';
import { Command, CommandRunOptions } from '../../structures/Command';

class MuteCommand extends Command {
  name = 'mute';
  category = 'Moderation';
  aliases = [];
  description = `Выдаёт мут пользователю.
  Время должно быть записано без пробелов. Поддерживаются дни, часы и минуты.
  
  Поддерживается русский(день, час, минута) и английский(day, hour, minute), а так же укороченные варианты записи времени(д, ч, м или d, h, m).
  
  Имеется ключ -F, который позволяет перезаписать текущее время мута у участника. 
  Т.е. если у пользователя был мут на 5 минут, а вы ему выдали мут с этим ключем на час, то время его мута будет равно часу
  
  Список всех мутов у пользователя можно посмотреть командой >mutes
  
  Каждый мут даёт +${KARMA_FOR_MUTE} кармы.`;
  examples = [
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
  ];
  usage = 'mute <пользователь> <время> [причина]';
  botPermissions: PermissionString[] = ['MODERATE_MEMBERS'];
  memberPermissions: PermissionString[] = ['BAN_MEMBERS'];

  async run({ client, message, args, attributes }: CommandRunOptions) {
    const targetMember = message.mentions.members.first();

    if (!targetMember) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (
      targetMember.permissions.has('BAN_MEMBERS') ||
      targetMember.permissions.has('MODERATE_MEMBERS') ||
      targetMember.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0 ||
      targetMember.permissions.has('ADMINISTRATOR')
    ) {
      const embed = ErrorEmbed('У вас нет прав, что бы замутить этого пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const forceMute = attributes.has('F') || attributes.has('-F');

    if (targetMember.communicationDisabledUntilTimestamp > Date.now() && !forceMute) {
      const duration = Date.now() - targetMember.communicationDisabledUntilTimestamp;

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

    const totalTime = await client.service.calculateMuteTime(getMemberBaseId(targetMember), time.asMilliseconds());
    const formattedTime = formatDuration(moment.duration(totalTime));
    const formattedTotalTimeWithOnlyKarma = formatDurationInPast(moment.duration(totalTime - time.asMilliseconds()));

    const karma = await client.service.getKarma(getMemberBaseId(targetMember));

    const text = karma
      ? `Пользователь ${targetMember} был замучен на ${formattedTime}, из них ${formattedTotalTimeWithOnlyKarma} (+${karma}%) он получил из-за кармы`
      : `Пользователь ${targetMember} был замучен на ${formattedTime}`;
    const directText = `${Emojis.Info} На сервере \`${message.guild}\` Вы были замучены пользователем ${
      message.author
    } на ${formattedTime}
    ${karma ? `Из них ${formattedTotalTimeWithOnlyKarma} (+${karma}%) Вы получили из-за кармы` : ''}`;

    const embed = SuccessEmbed(text);
    const directEmbed = new MessageEmbed().setDescription(directText).setColor(Colors.Red).setTimestamp();

    if (reason) {
      embed.setFooter({ text: `По причине: ${reason}` });
      directEmbed.setFooter({ text: `По причине: ${reason}` });
    }

    await targetMember.timeout(totalTime, reason);

    const mute: Mute = {
      date: Date.now(),
      reason: reason,
      givenBy: message.author.id,
      time: totalTime,
    };

    client.service.addMute(getMemberBaseId(targetMember), mute);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    targetMember.send({ embeds: [directEmbed] });
  }
}

export default new MuteCommand();
