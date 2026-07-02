import { create } from "zustand";
import type { AppSettings, Note, Tab, Tag, EditorMode, ClipboardEntry, SearchResultItem } from "../types";
import * as ipc from "../bridge/ipc";

interface AppState {
  settings: AppSettings;
  notes: Note[];
  tags: Tag[];
  clipboardEntries: ClipboardEntry[];
  activeTab: Tab;
  searchQuery: string;
  selectedTagId: string | null;
  editorMode: EditorMode;
  showArchived: boolean;
  showDeleted: boolean;
  clipboardSearchQuery: string;
  globalSearchOpen: boolean;
  globalSearchQuery: string;
  globalSearchResults: SearchResultItem[];
  loaded: boolean;

  loadAll: () => Promise<void>;
  updateSettings: (s: Partial<AppSettings>) => Promise<void>;
  setNotes: (notes: Note[]) => void;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setActiveTab: (tab: Tab) => void;
  setSearchQuery: (q: string) => void;

  loadTags: () => Promise<void>;
  saveTag: (tag: Tag) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  setSelectedTagId: (id: string | null) => void;
  setEditorMode: (mode: EditorMode) => void;

  archiveNote: (id: string) => Promise<void>;
  restoreArchive: (id: string) => Promise<void>;
  softDeleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  purgeTrash: () => Promise<void>;
  setShowArchived: (v: boolean) => void;
  setShowDeleted: (v: boolean) => void;

  loadClipboardEntries: () => Promise<void>;
  addClipboardEntry: (entry: ClipboardEntry) => void;
  deleteClipboardEntry: (id: string) => Promise<void>;
  clearClipboardHistory: () => Promise<void>;
  starClipboardEntry: (id: string, starred: boolean) => Promise<void>;
  setClipboardSearchQuery: (q: string) => void;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  setGlobalSearchQuery: (q: string) => void;
  setGlobalSearchResults: (results: SearchResultItem[]) => void;
  moveNote: (id: string, direction: string) => Promise<void>;
  moveClipboardEntry: (id: string, direction: string) => Promise<void>;
}

const defaults: AppSettings = {
  theme: "system",
  panel_position: "right",
  opacity: 0.85,
  autostart: false,
  shortcut_toggle: "Alt+Space",
  window_width: 360,
  window_height: 720,
  archive_days: 30,
  accent_color: "#4F8CFF",
  animations_enabled: true,
  language: "en-US",
};

export const useAppStore = create<AppState>((set, get) => ({
  settings: { ...defaults },
  notes: [],
  tags: [],
  clipboardEntries: [],
  activeTab: "notes",
  searchQuery: "",
  selectedTagId: null,
  editorMode: "edit",
  showArchived: false,
  showDeleted: false,
  clipboardSearchQuery: "",
  globalSearchOpen: false,
  globalSearchQuery: "",
  globalSearchResults: [],
  loaded: false,

  loadAll: async () => {
    const [settings, notes, tags, clipboardEntries] = await Promise.all([
      ipc.getSettings().catch(() => undefined),
      ipc.getNotes().catch(() => [] as Note[]),
      ipc.getTags().catch(() => [] as Tag[]),
      ipc.getClipboardEntries().catch(() => [] as ClipboardEntry[]),
    ]);
    set({
      settings: settings || ({ ...defaults } as AppSettings),
      notes: notes || [],
      tags: tags || [],
      clipboardEntries: clipboardEntries || [],
      loaded: true,
    });
  },

  updateSettings: async (partial) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    await ipc.saveSettings(updated);
    set({ settings: updated });
    if (partial.opacity !== undefined) {
      ipc.setWindowOpacity(partial.opacity).catch(() => {});
    }
    if (partial.panel_position !== undefined) {
      ipc.setWindowPosition(partial.panel_position).catch(() => {});
    }
  },

  setNotes: (notes) => set({ notes }),

  saveNote: async (note) => {
    await ipc.saveNote(note);
    const notes = get().notes;
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      set({ notes: notes.map((n) => (n.id === note.id ? note : n)) });
    } else {
      set({ notes: [note, ...notes] });
    }
  },

  deleteNote: async (id) => {
    await ipc.deleteNote(id);
    set({ notes: get().notes.filter((n) => n.id !== id) });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedTagId: (id) => set({ selectedTagId: id }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  setShowArchived: (v) => set({ showArchived: v, showDeleted: false }),
  setShowDeleted: (v) => set({ showDeleted: v, showArchived: false }),

  loadTags: async () => {
    try { set({ tags: await ipc.getTags() }); } catch {}
  },

  saveTag: async (tag) => {
    await ipc.saveTag(tag);
    const tags = get().tags;
    const idx = tags.findIndex((t) => t.id === tag.id);
    if (idx >= 0) {
      set({ tags: tags.map((t) => (t.id === tag.id ? tag : t)) });
    } else {
      set({ tags: [...tags, tag] });
    }
  },

  deleteTag: async (id) => {
    await ipc.deleteTag(id);
    set({ tags: get().tags.filter((t) => t.id !== id) });
  },

  archiveNote: async (id) => {
    await ipc.archiveNote(id);
    set({ notes: get().notes.map((n) => n.id === id ? { ...n, archived: true } : n) });
  },

  restoreArchive: async (id) => {
    await ipc.restoreArchive(id);
    set({ notes: get().notes.map((n) => n.id === id ? { ...n, archived: false } : n) });
  },

  softDeleteNote: async (id) => {
    await ipc.softDeleteNote(id);
    const now = Date.now();
    set({ notes: get().notes.map((n) => n.id === id ? { ...n, deleted_at: now } : n) });
  },

  restoreNote: async (id) => {
    await ipc.restoreNote(id);
    set({ notes: get().notes.map((n) => n.id === id ? { ...n, deleted_at: null, archived: false } : n) });
  },

  purgeTrash: async () => {
    await ipc.purgeTrash();
    set({ notes: get().notes.filter((n) => n.deleted_at === null) });
  },

  loadClipboardEntries: async () => {
    try { set({ clipboardEntries: await ipc.getClipboardEntries() }); } catch {}
  },

  addClipboardEntry: (entry) => {
    set({ clipboardEntries: [entry, ...get().clipboardEntries] });
  },

  deleteClipboardEntry: async (id) => {
    await ipc.deleteClipboardEntry(id);
    set({ clipboardEntries: get().clipboardEntries.filter((e) => e.id !== id) });
  },

  clearClipboardHistory: async () => {
    await ipc.clearClipboardHistory();
    set({ clipboardEntries: [] });
  },

  starClipboardEntry: async (id, starred) => {
    await ipc.starClipboardEntry(id, starred);
    set({
      clipboardEntries: get().clipboardEntries.map((e) =>
        e.id === id ? { ...e, starred } : e
      ),
    });
  },

  setClipboardSearchQuery: (q) => set({ clipboardSearchQuery: q }),
  openGlobalSearch: () => set({ globalSearchOpen: true, globalSearchQuery: "", globalSearchResults: [] }),
  closeGlobalSearch: () => set({ globalSearchOpen: false, globalSearchQuery: "", globalSearchResults: [] }),
  setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),
  setGlobalSearchResults: (results) => set({ globalSearchResults: results }),

  moveNote: async (id, direction) => {
    await ipc.moveNote(id, direction);
    const notes = [...get().notes];
    const idx = notes.findIndex((n) => n.id === id);
    const target = direction === "up" && idx > 0 ? idx - 1
      : direction === "down" && idx < notes.length - 1 ? idx + 1 : -1;
    if (target >= 0) { [notes[idx], notes[target]] = [notes[target], notes[idx]]; set({ notes }); }
  },

  moveClipboardEntry: async (id, direction) => {
    await ipc.moveClipboardEntry(id, direction);
    const entries = [...get().clipboardEntries];
    const idx = entries.findIndex((e) => e.id === id);
    const target = direction === "up" && idx > 0 ? idx - 1
      : direction === "down" && idx < entries.length - 1 ? idx + 1 : -1;
    if (target >= 0) { [entries[idx], entries[target]] = [entries[target], entries[idx]]; set({ clipboardEntries: entries }); }
  },
}));