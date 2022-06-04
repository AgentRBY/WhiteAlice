import { MessageEmbed } from 'discord.js';
import { Colors } from '../../static/Colors';
import { Emojis } from '../../static/Emojis';
import { ErrorEmbed } from '../../utils/Discord/Embed';
import { Command, CommandExample, CommandRunOptions } from '../../structures/Command';

class NotesCommand extends Command {
  name = 'notes';
  category = 'Utils';
  aliases = [];
  description = 'Выводит список всех заметок';
  examples: CommandExample[] = [
    {
      command: 'notes',
      description: 'Выводит список всех заметок',
    },
  ];
  usage = 'notes';

  async run({ client, message }: CommandRunOptions) {
    const notes = await client.service.getNotes(message.guildId);

    if (!notes) {
      const embed = ErrorEmbed('На данном сервере отсутствуют заметки');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const formattedNotes = notes.map((note) => note.name).join('`, `');

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setDescription(`${Emojis.Info} Список всех заметок: \`${formattedNotes}\``);
    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new NotesCommand();
