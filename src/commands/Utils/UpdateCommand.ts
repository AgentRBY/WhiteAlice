import {SuccessEmbed} from '../../utils/Embed';
import {Command} from '../../structures/Command';

const cmd = require('node-cmd');

export default new Command({
  name: 'update',
  category: 'Utils',
  aliases: [],
  description: 'Делает git pull тем самым обновляя бота до последней версии с гита',
  examples: [],
  usage: 'update',
  ownerOnly: true,
  run: async ({ message }) => {
    cmd.run('git pull', (error: string, data: string) => {
      console.log(data);
      console.log(error);
      message.reply({ embeds: [SuccessEmbed(data || error)], allowedMentions: { repliedUser: false } });
    });
  },
});
