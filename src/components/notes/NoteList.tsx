import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import type { Note } from "../../types";
import { Plus, Pin, Trash2, Archive, ChevronUp, ChevronDown } from "lucide-react";
import CategoryFilter from "../tags/CategoryFilter";
import ArchiveToggle from "./ArchiveToggle";
import TrashBin from "./TrashBin";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function NoteList() {
  const { t } = useTranslation();
  const {
    moveNote,
    notes, searchQuery, selectedTagId,
    showArchived, showDeleted,
    saveNote, archiveNote, restoreArchive, softDeleteNote
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
        <span className="note-count">{showArchived ? t("notes.archivedCount", { count: filtered.length }) : t("notes.count", { count: filtered.length })}</span>
        <button className="note-new-btn" onClick={handleNew} title={t("notes.newNote")}>
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
            onMove={moveNote}
            onArchive={showArchived ? restoreArchive : archiveNote}
                      />
        ))}
      </div>
    </div>
  );
}

function NoteListItem({
  note, showArchived, onSave, onDelete, onMove, onArchive,
}: {
  note: Note;
  showArchived: boolean;
  onSave: (n: Note) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  
  onMove: (id: string, dir: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const togglePin = () => onSave({ ...note, pinned: !note.pinned });
  const line = note.content.split("\n")[0] || "";
  const text = line.slice(0, 60) || t("notes.empty");

  return (
    <div className={`note-item ${note.pinned ? "pinned" : ""} ${note.archived ? "archived" : ""}`}>
      <div className="note-item-move">
        <button className="note-item-move-btn" onClick={() => onMove(note.id, "up")} title="Move up"><ChevronUp size={10} /></button>
        <button className="note-item-move-btn" onClick={() => onMove(note.id, "down")} title="Move down"><ChevronDown size={10} /></button>
      </div>
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