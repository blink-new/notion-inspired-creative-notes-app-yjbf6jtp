import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { Note } from '@/types/note';
import { noteStorage } from '@/lib/noteStorage';
import { Toaster } from '@/components/ui/toaster';
import toast from 'react-hot-toast';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Load notes on app start
  useEffect(() => {
    const loadedNotes = noteStorage.getNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      setSelectedNote(loadedNotes[0]);
    }
  }, []);

  const handleCreateNote = () => {
    const newNote = noteStorage.createNote();
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    toast.success('New note created!');
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    noteStorage.saveNote(updatedNote);
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = (noteId: string) => {
    noteStorage.deleteNote(noteId);
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setSelectedNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
    toast.success('Note deleted!');
  };

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
      />
      <NoteEditor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
      />
      <Toaster />
    </div>
  );
}

export default App;
