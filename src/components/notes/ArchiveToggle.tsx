import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import { Archive, Trash2, FileText } from "lucide-react";

export default function ArchiveToggle() {
  const { t } = useTranslation();
  const { showArchived, showDeleted, setShowArchived, setShowDeleted } = useAppStore();

  const mode = showDeleted ? "trash" : showArchived ? "archive" : "active";

  return (
    <div className="archive-toggle">
      <button
        className={`archive-toggle-btn ${mode === "active" ? "active" : ""}`}
        onClick={() => { setShowDeleted(false); setShowArchived(false); }}
        title={t("notes.active")}
      >
        <FileText size={12} /> {t("notes.active")}
      </button>
      <button
        className={`archive-toggle-btn ${mode === "archive" ? "active" : ""}`}
        onClick={() => setShowArchived(true)}
        title={t("notes.archived")}
      >
        <Archive size={12} /> {t("notes.archived")}
      </button>
      <button
        className={`archive-toggle-btn ${mode === "trash" ? "active" : ""}`}
        onClick={() => setShowDeleted(true)}
        title={t("notes.trash")}
      >
        <Trash2 size={12} /> {t("notes.trash")}
      </button>
    </div>
  );
}