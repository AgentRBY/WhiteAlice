import { Command } from '../../structures/Command';

export default new Command({
  name: 'rickRoll',
  category: 'Music',
  aliases: [],
  description: 'Never Gonna Give You Up',
  examples: [],
  usage: 'rickRoll',
  run: async ({ client, message }) => {
    client.commands.get('play').run({ client, message, args: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'] });
  },
});
