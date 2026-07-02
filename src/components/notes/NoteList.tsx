import { useAppStore } from "../../stores/appStore";
import type { Note } from "../../types";
import { Plus, Pin, Trash2, Archive, RotateCcw } from "lucide-react";
import CategoryFilter from "../tags/CategoryFilter";
import ArchiveToggle from "./ArchiveToggle";
import TrashBin from "./TrashBin";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function NoteList() {
  const {
    notes, searchQuery, selectedTagId,
    showArchived, showDeleted,
    saveNote, deleteNote, archiveNote, restoreArchive, softDeleteNote, restoreNote
  } = useAppStore();

  // If trash view is active, show TrashBin instead
  if (showDeleted) {
    return (
      <div className="note-list">
        <ArchiveToggle />
        <div className="note-list-body">
          <TrashBin />
        </div>
      </div>
    );
  }

  let filtered = notes.filter((n) => {
    // Always exclude deleted notes
    if (n.deleted_at !== null) return false;
    // If not showing archived, exclude archived too
    if (!showArchived && n.archived) return false;
    return true;
  });

  if (selectedTagId) {
    filtered = filtered.filter((n) => n.tags.includes(selectedTagId));
  }

  if (searchQuery) {
    filtered = filtered.filter((n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updated_at - a.updated_at;
  });

  const handleNew = async () => {
    const now = Date.now();
    const note: Note = {
      id: generateId(),
      content: "",
      created_at: now,
      updated_at: now,
      pinned: false,
      tags: [],
      category: null,
      archived: false,
      deleted_at: null,
    };
    await saveNote(note);
  };

  return (
    <div className="note-list">
      <ArchiveToggle />
      <div className="note-list-header">
        <span className="note-count">{filtered.length} {showArchived ? "archived" : "notes"}</span>
        <button className="note-new-btn" onClick={handleNew} title="New note">
          <Plus size={16} />
        </button>
      </div>
      <CategoryFilter />
      <div className="note-list-items">
        {sorted.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
            showArchived={showArchived}
            onSave={saveNote}
            onDelete={softDeleteNote}
            onArchive={showArchived ? restoreArchive : archiveNote}
            onRestore={restoreNote}
            onHardDelete={deleteNote}
          />
        ))}
      </div>
    </div>
  );
}

function NoteListItem({
  note, showArchived, onSave, onDelete, onArchive, onRestore, onHardDelete,
}: {
  note: Note;
  showArchived: boolean;
  onSave: (n: Note) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onHardDelete: (id: string) => Promise<void>;
}) {
  const togglePin = () => onSave({ ...note, pinned: !note.pinned });
  const line = note.content.split("\n")[0] || "";
  const text = line.slice(0, 60) || "Empty note";

  return (
    <div className={`note-item ${note.pinned ? "pinned" : ""} ${note.archived ? "archived" : ""}`}>
      <button className="note-item-main" onClick={togglePin}>
        <Pin size={12} className={`pin-icon ${note.pinned ? "pinned" : ""}`} />
        <span className="note-item-preview">{text}</span>
      </button>
      <div className="note-item-actions">
        <button className="note-item-action-btn" onClick={() => onDelete(note.id)} title="Move to trash">
          <Trash2 size={12} />
        </button>
        <button className="note-item-action-btn" onClick={() => onArchive(note.id)} title={showArchived ? "Unarchive" : "Archive"}>
          <Archive size={12} />
        </button>
      </div>
    </div>
  );
}