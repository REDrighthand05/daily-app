import { invoke } from "@tauri-apps/api/core";
import type { AppSettings, Note } from "../types";

export const getSettings = (): Promise<AppSettings> => invoke("get_settings");
export const saveSettings = (settings: AppSettings): Promise<void> =>
  invoke("save_settings", { settings });

export const getNotes = (): Promise<Note[]> => invoke("get_notes");
export const saveNote = (note: Note): Promise<void> =>
  invoke("save_note", { note });
export const deleteNote = (id: string): Promise<void> =>
  invoke("delete_note", { id });

// Window management
export const setWindowOpacity = (opacity: number): Promise<void> =>
  invoke("set_window_opacity", { opacity });
export const setWindowPosition = (position: string): Promise<void> =>
  invoke("set_window_position", { position });
export const detachWindow = (): Promise<void> => invoke("detach_window");
export const attachWindow = (): Promise<void> => invoke("attach_window");