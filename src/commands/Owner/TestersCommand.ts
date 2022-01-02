import { Command } from '../../structures/Command';
import { GuildModel } from '../../models/GuildModel';
import { getMembersFromLines } from '../../utils/Users';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

export default new Command({
  name: 'testers',
  category: 'Owner',
  aliases: [],
  description: '',
  examples: [],
  usage: 'testers',
  ownerOnly: true,
  run: async ({ message, args }) => {
    const members = getMembersFromLines(message.guild, args);

    if (!members.length) {
      const embed = ErrorEmbed('Введите пользователя');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const membersId = members.map((member) => member.id);
    const result = await GuildModel.updateOne(
      { _id: message.guild.id },
      { $addToSet: { testersID: { $each: membersId } } },
    );

    const embed = SuccessEmbed(`Добавлено ${result.modifiedCount} тестеров`);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
  },
});
