import type { EditorMode } from "../../types";
import { Bold, Italic, Heading, Code, List, Eye, Edit3 } from "lucide-react";

interface Props {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onInsert: (before: string, after: string) => void;
}

export default function EditorToolbar({ mode, onModeChange, onInsert }: Props) {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-actions">
        <button onClick={() => onInsert("**", "**")} title="Bold" className="toolbar-btn">
          <Bold size={14} />
        </button>
        <button onClick={() => onInsert("*", "*")} title="Italic" className="toolbar-btn">
          <Italic size={14} />
        </button>
        <button onClick={() => onInsert("## ", "")} title="Heading" className="toolbar-btn">
          <Heading size={14} />
        </button>
        <button onClick={() => onInsert("- ", "")} title="List" className="toolbar-btn">
          <List size={14} />
        </button>
        <button onClick={() => onInsert("```\n", "\n```")} title="Code block" className="toolbar-btn">
          <Code size={14} />
        </button>
      </div>
      <div className="editor-toolbar-modes">
        <button
          className={`toolbar-mode-btn ${mode === "edit" ? "active" : ""}`}
          onClick={() => onModeChange("edit")}
          title="Edit"
        >
          <Edit3 size={14} />
        </button>
        <button
          className={`toolbar-mode-btn ${mode === "preview" ? "active" : ""}`}
          onClick={() => onModeChange("preview")}
          title="Preview"
        >
          <Eye size={14} />
        </button>
      </div>
    </div>
  );
}