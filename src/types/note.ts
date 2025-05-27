export interface Note {
  id: string;
  title: string;
  blocks: NoteBlock[];
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BlockType = 'heading' | 'paragraph' | 'bullet-list' | 'quote';

export interface NoteBlock {
  id: string;
  type: BlockType;
  content: string;
}