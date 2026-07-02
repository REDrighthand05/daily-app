import { useState, useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import type { Note } from "../../types";

export default function NoteEditor() {
  const { notes, saveNote } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const sorted = [...notes].sort((a, b) => b.updated_at - a.updated_at);
  const editingNote = editingId
    ? notes.find((n) => n.id === editingId)
    : sorted[0];

  // Auto-open first note
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

  return (
    <div className="note-editor">
      <textarea
        value={editingNote.content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing..."
        autoFocus
      />
    </div>
  );
}
