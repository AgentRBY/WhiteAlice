import { ErrorEmbed } from '../../utils/Embed';
import { Command } from '../../structures/Command';
import { TextChannel } from 'discord.js';

export default new Command({
  name: 'play',
  category: 'Music',
  aliases: ['p', 'плэй', 'музыка', 'запустить'],
  description:
    'Проиграть трек. Поддерживает запросы и ссылки на YouTube, ссылки на плейлисты в Spotify' + ' и SoundCloud',
  usage: 'play <запрос>',
  examples: [
    {
      command: 'play Never Gonna Give You Up',
      description: 'Воспроизводит `Never Gonna Give You Up` от `Rick Astley`',
    },
    {
      command: 'play https://open.spotify.com/playlist/69l7D0fGepx502NI7YfVdz',
      description: 'Воспроизводит `Lo-fi gaming beats` плейлист из Spotify',
    },
  ],
  run: async ({ client, message, args }) => {
    if (!message.member?.voice.channel) {
      const embed = ErrorEmbed('**Вы не находитесь в голосовом канале**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    if (!args.length) {
      const embed = ErrorEmbed('**Вы не указали запрос**');
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }

    try {
      await client.disTube.play(message.member.voice.channel, args.join(' '), {
        message,
        member: message.member,
        textChannel: message.channel as TextChannel,
      });
    } catch (error) {
      const embed = ErrorEmbed(`**Произошла ошибка ${error}**`);
      return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
  },
});
