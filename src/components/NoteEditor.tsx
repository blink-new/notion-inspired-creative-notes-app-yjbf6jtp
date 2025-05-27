import { useState, useEffect } from 'react';
import { Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Note, BlockType } from '@/types/note';

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (note: Note) => void;
}


export function NoteEditor({ note, onUpdateNote }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<NoteBlock[]>([]);
  const [emoji, setEmoji] = useState('📝');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBlocks(note.blocks);
      setEmoji(note.emoji);
    }
  }, [note]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (note) {
      onUpdateNote({
        ...note,
        title: newTitle,
        updatedAt: new Date(),
      });
    }
  };

  const handleBlockChange = (blockId: string, newContent: string) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    setBlocks(newBlocks);
    if (note) {
      onUpdateNote({
        ...note,
        blocks: newBlocks,
        updatedAt: new Date(),
      });
    }
  };

  const handleBlockTypeChange = (blockId: string, newType: BlockType) => {
    const newBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, type: newType } : block
    );
    setBlocks(newBlocks);
    if (note) {
      onUpdateNote({
        ...note,
        blocks: newBlocks,
        updatedAt: new Date(),
      });
    }
  };

  const handleAddBlock = (type: BlockType = 'paragraph') => {
    const newBlock: NoteBlock = {
      id: crypto.randomUUID(),
      type,
      content: '',
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    if (note) {
      onUpdateNote({
        ...note,
        blocks: newBlocks,
        updatedAt: new Date(),
      });
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    const newBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(newBlocks);
    if (note) {
      onUpdateNote({
        ...note,
        blocks: newBlocks,
        updatedAt: new Date(),
      });
    }
  };

  const handleEmojiChange = (newEmoji: string) => {
    setEmoji(newEmoji);
    if (note) {
      onUpdateNote({
        ...note,
        emoji: newEmoji,
        updatedAt: new Date(),
      });
    }
  };

  const popularEmojis = ['📝', '💡', '🎯', '📚', '✨', '🔥', '💭', '🎨', '📋', '⭐'];

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <Type className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-medium mb-2">Select a note to edit</h2>
          <p className="text-gray-400">Choose a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative group">
            <button 
              className="text-4xl hover:bg-gray-100 rounded-lg p-2 transition-colors"
              onClick={() => {
                const newEmoji = popularEmojis[Math.floor(Math.random() * popularEmojis.length)];
                handleEmojiChange(newEmoji);
              }}
            >
              {emoji}
            </button>
            <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <div className="grid grid-cols-5 gap-1">
                {popularEmojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => handleEmojiChange(e)}
                    className="text-xl hover:bg-gray-100 rounded p-1"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="text-3xl font-bold border-none shadow-none p-0 h-auto bg-transparent placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Block Editor */}
      <div className="flex-1 p-6 space-y-4">
        {blocks.map(block => (
          <div key={block.id} className="group flex items-start gap-2">
            <select
              value={block.type}
              onChange={e => handleBlockTypeChange(block.id, e.target.value as BlockType)}
              className="rounded border-gray-200 text-xs px-2 py-1 bg-gray-50 text-gray-600 focus:outline-none"
            >
              <option value="heading">Heading</option>
              <option value="paragraph">Text</option>
              <option value="bullet-list">List</option>
              <option value="quote">Quote</option>
            </select>
            {block.type === 'heading' && (
              <input
                type="text"
                value={block.content}
                onChange={e => handleBlockChange(block.id, e.target.value)}
                placeholder="Heading..."
                className="text-2xl font-bold flex-1 bg-transparent border-none outline-none placeholder:text-gray-300"
              />
            )}
            {block.type === 'paragraph' && (
              <textarea
                value={block.content}
                onChange={e => handleBlockChange(block.id, e.target.value)}
                placeholder="Text..."
                className="flex-1 bg-transparent border-none outline-none resize-none placeholder:text-gray-300 min-h-[32px]"
              />
            )}
            {block.type === 'bullet-list' && (
              <textarea
                value={block.content}
                onChange={e => handleBlockChange(block.id, e.target.value)}
                placeholder="List (one item per line)"
                className="flex-1 bg-transparent border-none outline-none resize-none placeholder:text-gray-300 min-h-[32px]"
              />
            )}
            {block.type === 'quote' && (
              <textarea
                value={block.content}
                onChange={e => handleBlockChange(block.id, e.target.value)}
                placeholder="Quote..."
                className="flex-1 italic bg-transparent border-l-4 border-gray-200 pl-4 outline-none resize-none placeholder:text-gray-300 min-h-[32px]"
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2"
              onClick={() => handleDeleteBlock(block.id)}
              title="Delete block"
            >
              ×
            </Button>
          </div>
        ))}
        <div>
          <Button size="sm" variant="outline" onClick={() => handleAddBlock('paragraph')}>
            + Add block
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-6 py-3">
        <p className="text-sm text-gray-400">
          Last edited {note.updatedAt.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
