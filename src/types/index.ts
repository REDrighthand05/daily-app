export interface AppSettings {
  theme: "dark" | "light" | "system";
  panel_position: "left" | "right" | "float";
  opacity: number;
  autostart: boolean;
  shortcut_toggle: string;
  window_width: number;
  window_height: number;
}

export interface Note {
  id: string;
  content: string;
  created_at: number;
  updated_at: number;
  pinned: boolean;
}

export type Tab = "notes" | "settings";
