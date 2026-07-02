export interface AppSettings {
  theme: "dark" | "light" | "system";
  panel_position: "left" | "right" | "float";
  opacity: number;
  autostart: boolean;
  shortcut_toggle: string;
  window_width: number;
  window_height: number;
  archive_days: number;
  accent_color: string;
  animations_enabled: boolean;
  language: string;
}

export interface Note {
  id: string;
  content: string;
  created_at: number;
  updated_at: number;
  pinned: boolean;
  tags: string[];
  category: string | null;
  archived: boolean;
  deleted_at: number | null;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface ClipboardEntry {
  id: string;
  content: string;
  content_type: string;
  content_hash: string;
  created_at: number;
  starred: boolean;
}

export type EditorMode = "edit" | "preview" | "split";

export type Tab = "notes" | "settings" | "clipboard";

export interface SearchResultItem {
  id: string;
  source: "note" | "clipboard";
  title: string;
  snippet: string;
  timestamp: number;
}

export interface SystemInfo {
  os: string;
  os_version: string;
  app_version: string;
  arch: string;
}

export type ExportFormat = "markdown" | "text";
