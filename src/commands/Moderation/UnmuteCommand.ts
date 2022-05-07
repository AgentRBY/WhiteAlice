import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';
import moment from 'moment';
import { MessageEmbed } from 'discord.js';
import { Emojis } from '../../static/Emojis';
import { Colors } from '../../static/Colors';
import { MemberModel } from '../../models/MemberModel';

export default new Command({
  name: 'unmute',
  category: 'Moderation',
  aliases: ['removeMute'],
  description: 'Размучивает человека, если он был замучен',
  examples: [
    {
      command: 'unmute @TestUser',
      description: 'Убирает мут у пользователя @TestUser',
    },
    {
      command: 'unmute @TestUser Ошибочный мут',
      description: 'Убирает мут у пользователя @TestUser по причине `Ошибочный мут`',
    },
  ],
  usage: 'unmute <пользователь> [причина]',
  botPermissions: ['MODERATE_MEMBERS'],
  memberPermissions: ['BAN_MEMBERS'],
  run: async ({ message, args }) => {
    const member = message.mentions.members.first();

    if (!member) {
      const embed = ErrorEmbed('Пользователь не найден');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (!member.isCommunicationDisabled()) {
      const embed = ErrorEmbed('Пользователь не в муте');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const reason = args.slice(1).join(' ');

    const remainingMuteTime = Date.now() - member.communicationDisabledUntilTimestamp;
    const remainingMuteTimeHumanize = moment.duration(remainingMuteTime).locale('ru').humanize();

    await member.timeout(null);

    const embed = SuccessEmbed(`Пользователь был размучен
        Если бы не вы, ему осталось бы сидеть в муте ${remainingMuteTimeHumanize}`);
    const directEmbed = new MessageEmbed()
      .setDescription(
        `${Emojis.Info} На сервере \`${message.guild}\` Вы были размучены пользователем ${message.author}`,
      )
      .setColor(Colors.Green);

    const MemberData = await MemberModel.findById(`${member.id}-${message.guildId}`);
    MemberData.mutes[MemberData.mutes.length - 1].unmuted = true;
    MemberData.mutes[MemberData.mutes.length - 1].unmutedDate = Date.now();
    MemberData.mutes[MemberData.mutes.length - 1].unmutedBy = message.author.id;

    if (reason) {
      MemberData.mutes[MemberData.mutes.length - 1].unmutedReason = reason;
      embed.setFooter({ text: `Причина размута: ${reason}` });
      directEmbed.setFooter({ text: `Причина размута: ${reason}` });
    }

    MemberData.save();

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    member.send({ embeds: [directEmbed] });
  },
});
