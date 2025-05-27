import { Note } from '@/types/note';

const STORAGE_KEY = 'notion-notes';

export const noteStorage = {
  getNotes(): Note[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const notes = JSON.parse(stored);
      // Migration: convert old notes with content string to blocks array
      return notes.map((note: any) => {
        if (note.blocks) {
          return {
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          };
        } else if (typeof note.content === 'string') {
          return {
            ...note,
            blocks: [
              {
                id: crypto.randomUUID(),
                type: 'paragraph',
                content: note.content,
              },
            ],
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          };
        } else {
          return {
            ...note,
            blocks: [],
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          };
        }
      });
    } catch {
      return [];
    }
  },

  saveNote(note: Note): void {
    const notes = this.getNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  },

  createNote(title: string = 'Untitled'): Note {
    const note: Note = {
      id: crypto.randomUUID(),
      title,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: 'paragraph',
          content: '',
        },
      ],
      emoji: '📝',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saveNote(note);
    return note;
  }
};
