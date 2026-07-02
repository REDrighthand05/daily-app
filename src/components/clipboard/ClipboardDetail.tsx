import type { ClipboardEntry as CEntry } from "../../types";
import { Star, Trash2, Clipboard, ArrowLeft } from "lucide-react";
import { writeClipboard } from "../../bridge/ipc";


interface Props {
  entry: CEntry;
  onBack: () => void;
  onDelete: (id: string) => void;
  onStar: (id: string, starred: boolean) => void;
}

export default function ClipboardDetail({ entry, onBack, onDelete, onStar }: Props) {
  const handleCopy = async () => {
    try { await writeClipboard(entry.content); } catch (e) { console.error("Clipboard copy failed:", e); }
  };

  return (
    <div className="cb-detail">
      <div className="cb-detail-header">
        <button className="cb-detail-btn" onClick={onBack}>
          <ArrowLeft size={14} /> Back
        </button>
        <div className="cb-detail-actions">
          <button className="cb-action-btn" onClick={handleCopy} title="Copy to clipboard">
            <Clipboard size={14} />
          </button>
          <button
            className={`cb-action-btn ${entry.starred ? "starred" : ""}`}
            onClick={() => onStar(entry.id, !entry.starred)}
            title={entry.starred ? "Unstar" : "Star"}
          >
            <Star size={14} />
          </button>
          <button className="cb-action-btn" onClick={() => onDelete(entry.id)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="cb-detail-content">
        <pre className="cb-detail-text">{entry.content}</pre>
      </div>
      <div className="cb-detail-meta">
        Type: {entry.content_type} | {new Date(entry.created_at).toLocaleString()}
      </div>
    </div>
  );
}