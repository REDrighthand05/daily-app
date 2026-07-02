import { useState, useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import type { Note } from "../../types";
import TagChip from "../tags/TagChip";
import TagPicker from "../tags/TagPicker";

export default function NoteEditor() {
  const { notes, tags, saveNote } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const sorted = [...notes].sort((a, b) => b.updated_at - a.updated_at);
  const editingNote = editingId
    ? notes.find((n) => n.id === editingId)
    : sorted[0];

  useEffect(() => {
    if (!editingId && notes.length > 0) {
      setEditingId(sorted[0]?.id ?? null);
    }
  }, [notes]);

  if (!editingNote) {
    return (
      <div className="note-editor-empty">
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  const handleChange = (content: string) => {
    const updated: Note = {
      ...editingNote,
      content,
      updated_at: Date.now(),
    };
    saveNote(updated);
  };

  const handleTagToggle = (tagId: string) => {
    const exists = editingNote.tags.includes(tagId);
    const newTags = exists
      ? editingNote.tags.filter((id) => id !== tagId)
      : [...editingNote.tags, tagId];
    saveNote({ ...editingNote, tags: newTags, updated_at: Date.now() });
  };

  const noteTags = tags.filter((t) => editingNote.tags.includes(t.id));

  return (
    <div className="note-editor">
      <div className="note-editor-tags">
        {noteTags.map((tag) => (
          <TagChip
            key={tag.id}
            tag={tag}
            onRemove={() => handleTagToggle(tag.id)}
          />
        ))}
        <button
          className="tag-picker-toggle"
          onClick={() => setShowTagPicker(!showTagPicker)}
        >
          {showTagPicker ? "Done" : "+ Tags"}
        </button>
      </div>
      {showTagPicker && (
        <TagPicker selectedIds={editingNote.tags} onToggle={handleTagToggle} />
      )}
      <textarea
        value={editingNote.content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing..."
        autoFocus
      />
    </div>
  );
}