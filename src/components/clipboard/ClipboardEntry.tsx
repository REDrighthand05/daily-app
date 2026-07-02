import type { ClipboardEntry as CEntry } from "../../types";
import { Star, Trash2, Clipboard } from "lucide-react";
import { writeClipboard } from "../../bridge/ipc";


interface Props {
  entry: CEntry;
  onDelete: (id: string) => void;
  onStar: (id: string, starred: boolean) => void;
  onClick: (entry: CEntry) => void;
}

export default function ClipboardEntryComponent({ entry, onDelete, onStar, onClick }: Props) {
  const preview = entry.content.slice(0, 80);

  const handleCopy = async () => {
    try { await writeClipboard(entry.content); } catch (e) { console.error("Clipboard copy failed:", e); }
  };

  const time = new Date(entry.created_at).toLocaleTimeString();

  return (
    <div className="cb-entry" onClick={() => onClick(entry)}>
      <div className="cb-entry-top">
        <span className="cb-entry-text">{preview}{entry.content.length > 80 ? "..." : ""}</span>
        <div className="cb-entry-actions">
          <button className="cb-action-btn" onClick={(e) => { e.stopPropagation(); handleCopy(); }} title="Copy">
            <Clipboard size={12} />
          </button>
          <button
            className={`cb-action-btn ${entry.starred ? "starred" : ""}`}
            onClick={(e) => { e.stopPropagation(); onStar(entry.id, !entry.starred); }}
            title={entry.starred ? "Unstar" : "Star"}
          >
            <Star size={12} />
          </button>
          <button className="cb-action-btn" onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }} title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="cb-entry-time">{time}</div>
    </div>
  );
}