import { Command } from '../../structures/Command';
import { ErrorEmbed, SuccessEmbed } from '../../utils/Discord/Embed';

export default new Command({
  name: 'prefix',
  category: 'Administration',
  aliases: [],
  description: '',
  examples: [],
  usage: 'update',
  memberPermissions: ['MANAGE_GUILD'],
  run: async ({ client, message, args }) => {
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

    client.service.setPrefix(message.guildId, prefix);

    const embed = SuccessEmbed(`Префикс успешно изменён на \`${prefix}\``);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  },
});
