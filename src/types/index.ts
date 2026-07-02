export interface AppSettings {
  theme: "dark" | "light" | "system";
  panel_position: "left" | "right" | "float";
  opacity: number;
  autostart: boolean;
  shortcut_toggle: string;
  window_width: number;
  window_height: number;
  archive_days: number;
}

export interface Note {
  deleted_at: number | null;
  id: string;
  content: string;
  created_at: number;
  updated_at: number;
  pinned: boolean;
  tags: string[];
  category: string | null;
  archived: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export type ExportFormat = "markdown" | "text";

export type EditorMode = "edit" | "preview" | "split";

export type Tab = "notes" | "settings";|export type ExportFormat = "markdown" | "text";

export type EditorMode = "edit" | "preview" | "split";

export type Tab = "notes" | "settings";