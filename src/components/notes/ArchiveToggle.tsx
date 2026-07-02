import { useAppStore } from "../../stores/appStore";
import { Archive, Trash2, FileText } from "lucide-react";

export default function ArchiveToggle() {
  const { showArchived, showDeleted, setShowArchived, setShowDeleted } = useAppStore();

  const mode = showDeleted ? "trash" : showArchived ? "archive" : "active";

  return (
    <div className="archive-toggle">
      <button
        className={`archive-toggle-btn ${mode === "active" ? "active" : ""}`}
        onClick={() => { setShowDeleted(false); setShowArchived(false); }}
        title="Active notes"
      >
        <FileText size={12} /> Active
      </button>
      <button
        className={`archive-toggle-btn ${mode === "archive" ? "active" : ""}`}
        onClick={() => setShowArchived(true)}
        title="Archived notes"
      >
        <Archive size={12} /> Archived
      </button>
      <button
        className={`archive-toggle-btn ${mode === "trash" ? "active" : ""}`}
        onClick={() => setShowDeleted(true)}
        title="Recently deleted"
      >
        <Trash2 size={12} /> Trash
      </button>
    </div>
  );
}