import { invoke } from "@tauri-apps/api/core";
import type { AppSettings, Note, Tag } from "../types";

export const getSettings = (): Promise<AppSettings> => invoke("get_settings");
export const saveSettings = (settings: AppSettings): Promise<void> =>
  invoke("save_settings", { settings });

export const getNotes = (): Promise<Note[]> => invoke("get_notes");
export const saveNote = (note: Note): Promise<void> =>
  invoke("save_note", { note });
export const deleteNote = (id: string): Promise<void> =>
  invoke("delete_note", { id });

// Tags
export const getTags = (): Promise<Tag[]> => invoke("get_tags");
export const saveTag = (tag: Tag): Promise<void> => invoke("save_tag", { tag });
export const deleteTag = (id: string): Promise<void> => invoke("delete_tag", { id });
export const filterNotesByTag = (tagId: string): Promise<Note[]> =>
  invoke("filter_notes_by_tag", { tagId });

// Window management
export const setWindowOpacity = (opacity: number): Promise<void> =>
  invoke("set_window_opacity", { opacity });
export const setWindowPosition = (position: string): Promise<void> =>
  invoke("set_window_position", { position });
export const detachWindow = (): Promise<void> => invoke("detach_window");
export const attachWindow = (): Promise<void> => invoke("attach_window");