import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import type { ClipboardEntry as CEntry } from "../../types";
import ClipboardEntryComponent from "./ClipboardEntry";
import ClipboardSearch from "./ClipboardSearch";
import ClipboardDetail from "./ClipboardDetail";
import { Trash2 } from "lucide-react";
import { clipboardPoll } from "../../bridge/ipc";

export default function ClipboardList() {
  const { t } = useTranslation();
  const {
    clipboardEntries, clipboardSearchQuery,
    loadClipboardEntries, addClipboardEntry,
    deleteClipboardEntry, clearClipboardHistory, starClipboardEntry,
  } = useAppStore();
  const [detailEntry, setDetailEntry] = useState<CEntry | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadClipboardEntries();
    pollRef.current = setInterval(async () => {
      try {
        const entry = await clipboardPoll();
        if (entry) addClipboardEntry(entry);
      } catch {}
    }, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  if (detailEntry) {
    return (
      <ClipboardDetail
        entry={detailEntry}
        onBack={() => setDetailEntry(null)}
        onDelete={async (id) => { await deleteClipboardEntry(id); setDetailEntry(null); }}
        onStar={(id, s) => starClipboardEntry(id, s)}
      />
    );
  }

  const filtered = clipboardSearchQuery
    ? clipboardEntries.filter((e) =>
        e.content.toLowerCase().includes(clipboardSearchQuery.toLowerCase())
      )
    : clipboardEntries;

  return (
    <div className="clipboard-panel">
      <div className="clipboard-header">
        <span className="clipboard-count">{filtered.length}</span>
        <button
          className="clipboard-clear-btn"
          onClick={() => { if (confirm(t("clipboard.clearConfirm"))) clearClipboardHistory(); }}
          title="Clear history"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>
      <ClipboardSearch />
      <div className="clipboard-list">
        {filtered.map((entry) => (
          <ClipboardEntryComponent
            key={entry.id}
            entry={entry}
            onDelete={deleteClipboardEntry}
            onStar={starClipboardEntry}
            onClick={setDetailEntry}
          />
        ))}
      </div>
    </div>
  );
}