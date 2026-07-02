import { useAppStore } from "../../stores/appStore";
import { RotateCcw, Trash2, AlertTriangle } from "lucide-react";

export default function TrashBin() {
  const { notes, restoreNote, deleteNote, purgeTrash } = useAppStore();

  const deleted = notes.filter((n) => n.deleted_at !== null)
    .sort((a, b) => (b.deleted_at || 0) - (a.deleted_at || 0));

  const handlePurge = () => {
    if (confirm("Permanently delete all trashed notes?")) {
      purgeTrash();
    }
  };

  if (deleted.length === 0) {
    return (
      <div className="trash-empty">
        <p>Trash is empty</p>
      </div>
    );
  }

  return (
    <div className="trash-bin">
      <div className="trash-header">
        <span className="trash-count">{deleted.length} deleted</span>
        <button className="trash-purge-btn" onClick={handlePurge} title="Empty trash">
          <AlertTriangle size={12} /> Purge all
        </button>
      </div>
      <div className="trash-items">
        {deleted.map((note) => (
          <div key={note.id} className="trash-item">
            <span className="trash-item-preview">
              {note.content.slice(0, 50) || "Empty note"}
            </span>
            <div className="trash-item-actions">
              <button onClick={() => restoreNote(note.id)} title="Restore">
                <RotateCcw size={12} />
              </button>
              <button onClick={() => deleteNote(note.id)} title="Delete permanently">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}