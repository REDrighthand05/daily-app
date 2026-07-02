import { invoke } from "@tauri-apps/api/core";
import type { AppSettings, Note, Tag, ClipboardEntry, SearchResultItem, SystemInfo } from "../types";

export const getSettings = (): Promise<AppSettings> => invoke("get_settings");
export const saveSettings = (settings: AppSettings): Promise<void> =>
  invoke("save_settings", { settings });

export const getNotes = (): Promise<Note[]> => invoke("get_notes");
export const saveNote = (note: Note): Promise<void> =>
  invoke("save_note", { note });
export const deleteNote = (id: string): Promise<void> =>
  invoke("delete_note", { id });

export const archiveNote = (id: string): Promise<void> => invoke("archive_note", { id });
export const restoreArchive = (id: string): Promise<void> => invoke("restore_archive", { id });
export const softDeleteNote = (id: string): Promise<void> => invoke("soft_delete_note", { id });
export const restoreNote = (id: string): Promise<void> => invoke("restore_note", { id });
export const purgeTrash = (): Promise<void> => invoke("purge_trash");

// Tags
export const getTags = (): Promise<Tag[]> => invoke("get_tags");
export const saveTag = (tag: Tag): Promise<void> => invoke("save_tag", { tag });
export const deleteTag = (id: string): Promise<void> => invoke("delete_tag", { id });
export const filterNotesByTag = (tagId: string): Promise<Note[]> =>
  invoke("filter_notes_by_tag", { tagId });

// Markdown
export const renderMarkdown = (content: string): Promise<string> =>
  invoke("render_markdown", { content });

export const writeClipboard = (content: string): Promise<void> =>
  invoke("write_clipboard", { content });

// Clipboard
export const clipboardPoll = (): Promise<ClipboardEntry | null> => invoke("clipboard_poll");
export const getClipboardEntries = (): Promise<ClipboardEntry[]> => invoke("get_clipboard_entries");
export const deleteClipboardEntry = (id: string): Promise<void> => invoke("delete_clipboard_entry", { id });
export const clearClipboardHistory = (): Promise<void> => invoke("clear_clipboard_history");
export const starClipboardEntry = (id: string, starred: boolean): Promise<void> =>
  invoke("star_clipboard_entry", { id, starred });

// Reorder
export const moveNote = (id: string, direction: string): Promise<void> =>
  invoke("move_note", { id, direction });
export const moveClipboardEntry = (id: string, direction: string): Promise<void> =>
  invoke("move_clipboard_entry", { id, direction });

// Search
export const globalSearch = (query: string): Promise<SearchResultItem[]> =>
  invoke("global_search", { query });

// Export
export const writeFile = (path: string, content: string): Promise<void> =>
  invoke("write_file", { path, content });
export const batchExport = (baseDir: string, notes: Note[], format: string): Promise<void> =>
  invoke("batch_export", { baseDir, notes, format });

// Diagnostics
export const getSystemInfo = (): Promise<SystemInfo> => invoke("get_system_info");
export const createIssueReport = (info: SystemInfo, description: string): Promise<string> =>
  invoke("create_issue_report", { info, description });

// Backup
export const exportBackup = (path: string): Promise<void> =>
  invoke("export_backup", { path });
export const importBackup = (path: string): Promise<void> =>
  invoke("import_backup", { path });
export const factoryReset = (): Promise<void> =>
  invoke("factory_reset");

// Window management
export const setWindowOpacity = (opacity: number): Promise<void> =>
  invoke("set_window_opacity", { opacity, isDark });
export const setWindowPosition = (position: string): Promise<void> =>
  invoke("set_window_position", { position });
export const detachWindow = (): Promise<void> => invoke("detach_window");
export const attachWindow = (): Promise<void> => invoke("attach_window");