import { Service } from '../../structures/Service';
import { Snowflake } from 'discord.js';
import { Note } from '../../typings/GuildModel';

export class NotesAction {
  async getNotes(this: Service, id: Snowflake) {
    const GuildData = await this.getGuildData(id);

    return GuildData.notes;
  }

  async getNote(this: Service, id: Snowflake, noteName: string): Promise<Note> {
    const GuildData = await this.getGuildData(id);

    return GuildData.notes.find((note) => note.name === noteName);
  }

  async addNote(this: Service, id: Snowflake, note: Note): Promise<void> {
    this.updateGuildData(id, { $push: { notes: note } });
  }

  async removeNote(this: Service, id: Snowflake, noteName: string): Promise<void> {
    const GuildData = await this.getGuildData(id);

    const notes = GuildData.notes.filter((note) => note.name !== noteName);
    this.updateGuildData(id, { notes });
  }

  async isNoteExist(this: Service, id: Snowflake, noteName: string): Promise<Note> {
    const GuildData = await this.getGuildData(id);

    return GuildData.notes.find((note) => note.name === noteName);
  }
}
