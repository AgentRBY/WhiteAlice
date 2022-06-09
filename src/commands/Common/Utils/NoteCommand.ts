import { ErrorEmbed, SuccessEmbed } from '../../../utils/Discord/Embed';
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
        const embed = ErrorEmbed('У вас нет прав на создание заметки');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      const name = args[1];

      if (!name) {
        const embed = ErrorEmbed('Введите имя новой заметки');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      const content = args.slice(2).join(' ');

      if (await client.service.isNoteExist(message.guildId, name)) {
        const embed = ErrorEmbed('Заметка с таким именем уже существует');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      if (!content) {
        const embed = ErrorEmbed('Введите контент новой заметки');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      const note: Note = {
        name,
        content,
        createdAt: Date.now(),
        createdBy: message.author.id,
      };

      client.service.addNote(message.guildId, note);

      const embed = SuccessEmbed(`Заметка \`${note.name}\` была создана`);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    if (commandType === 'delete' || commandType === 'remove') {
      if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        const embed = ErrorEmbed('У вас нет прав на создание заметки');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      const name = args[1];

      if (!name) {
        const embed = ErrorEmbed('Введите имя заметки, которую хотите удалить');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      if (!(await client.service.isNoteExist(message.guildId, name))) {
        const embed = ErrorEmbed('Заметка с таким именем не найдена');
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        return;
      }

      client.service.removeNote(message.guildId, name);

      const embed = SuccessEmbed(`Заметка ${name} была удалена`);
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const noteName = commandType;

    if (!noteName) {
      const embed = ErrorEmbed('Введите имя заметки');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
      return;
    }

    const note = await client.service.getNote(message.guildId, noteName);

    if (!note) {
      const embed = ErrorEmbed('Заметка с таким именем не найдена');
      message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
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
