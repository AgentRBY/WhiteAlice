import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Embed';

export default new Command({
  name: 'prefix',
  category: 'Administration',
  aliases: [],
  description: '',
  examples: [],
  usage: 'update',
  run: async ({ message, args, GuildData }) => {
    if (!message.member.permissions.has('MANAGE_GUILD')) {
      const embed = ErrorEmbed('У вас недостаточно прав, что бы изменить префикс сервера');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const prefix = args[0];

    if (!prefix) {
      const embed = ErrorEmbed('Укажите префикс');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (prefix.length > 3) {
      const embed = ErrorEmbed('Длинна префикса не может быть больше 3 символов');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    await GuildData.updateOne({ prefix });

    const embed = SuccessEmbed(`Префикс успешно изменён на \`${prefix}\``);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
