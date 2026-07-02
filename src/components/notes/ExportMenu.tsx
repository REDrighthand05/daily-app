import type { Note } from "../../types";
import type { ExportFormat } from "../../types";
import { writeFile } from "../../bridge/ipc";
import { Download } from "lucide-react";
import { save } from "@tauri-apps/plugin-dialog";
import { useState } from "react";

interface Props {
  note: Note;
}

export default function ExportMenu({ note }: Props) {
  const [open, setOpen] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setOpen(false);
    const ext = format === "markdown" ? "md" : "txt";
    const defaultName = note.content.slice(0, 30).replace(/\s+/g, "_") || "note";
    try {
      const path = await save({
        filters: [{ name: format === "markdown" ? "Markdown" : "Text", extensions: [ext] }],
        defaultPath: `${defaultName}.${ext}`,
      });
      if (path) {
        await writeFile(path, note.content);
      }
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="export-menu">
      <button className="export-btn" onClick={() => setOpen(!open)} title="Export note">
        <Download size={14} />
      </button>
      {open && (
        <div className="export-dropdown">
          <button onClick={() => handleExport("markdown")}>Export as Markdown</button>
          <button onClick={() => handleExport("text")}>Export as Text</button>
        </div>
      )}
    </div>
  );
}