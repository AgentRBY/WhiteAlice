import { MessageEmbed } from 'discord.js';
import { Colors } from '../../../static/Colors';
import { EmojisLinks } from '../../../static/Emojis';
import { Note } from '../../../typings/GuildModel';
import { CommandExample, CommandRunOptions, CommonCommand } from '../../../structures/Commands/CommonCommand';

class NoteCommand extends CommonCommand {
  name = 'note';
  category = 'Utils';
  aliases = ['n'];
  description = `Позволяет вывести заметку. 
  Если первым аргументом будет имя заметки, то заметка выведется в чат.
  
  Если первым аргументом передан \`create\`; то будет создана новая заметка.
  Вторым аргументом должно быть имя, а остальные - контент.
  
  Если первым аргументом передан \`remove\` или \`delete\`, то заметка будет удалена.
  Вторым аргументом должно быть имя заметки.
  
  Для создания и удаления заметок нужно право \`Управлять сообщениями\``;
  examples: CommandExample[] = [
    {
      command: 'note example',
      description: 'Выводит заметку `example`',
    },
    {
      command: 'note create example This is example note',
      description: 'Создает заметку с именем `example` и контентом `This is example note`',
    },
    {
      command: 'note remove example',
      description: 'Удаляет заметку `example`',
    },
  ];
  usage = 'note <имя заметки|create|remove> [имя новой/удаляемой заметки] [контент новой заметки]';

  async run({ client, message, args }: CommandRunOptions) {
    const commandType = args[0];

    if (commandType === 'create') {
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        message.sendError('У вас нет прав на создание заметки');
        return;
      }

      const name = args[1];

      if (!name) {
        message.sendError('Введите имя новой заметки');
        return;
      }

      const content = args.slice(2).join(' ');

      if (await client.service.isNoteExist(message.guildId, name)) {
        message.sendError('Заметка с таким именем уже существует');
        return;
      }

      if (!content) {
        message.sendError('Введите контент новой заметки');
        return;
      }

      const note: Note = {
        name,
        content,
        createdAt: Date.now(),
        createdBy: message.author.id,
      };

      client.service.addNote(message.guildId, note);

      message.sendSuccess(`Заметка \`${note.name}\` была создана`);
      return;
    }

    if (commandType === 'delete' || commandType === 'remove') {
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        message.sendError('У вас нет прав на создание заметки');
        return;
      }

      const name = args[1];

      if (!name) {
        message.sendError('Введите имя заметки, которую хотите удалить');
        return;
      }

      if (!(await client.service.isNoteExist(message.guildId, name))) {
        message.sendError('Заметка с таким именем не найдена');
        return;
      }

      client.service.removeNote(message.guildId, name);

      message.sendSuccess(`Заметка ${name} была удалена`);
      return;
    }

    const noteName = commandType;

    if (!noteName) {
      message.sendError('Введите имя заметки');
      return;
    }

    const note = await client.service.getNote(message.guildId, noteName);

    if (!note) {
      message.sendError('Заметка с таким именем не найдена');
      return;
    }

    const embed = new MessageEmbed()
      .setColor(Colors.Blue)
      .setAuthor({
        name: note.name,
        iconURL: EmojisLinks.Info,
      })
      .setDescription(note.content);

    message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
  }
}

export default new NoteCommand();
