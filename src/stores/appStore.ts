import { create } from "zustand";
import type { AppSettings, Note, Tab, Tag, EditorMode } from "../types";
import * as ipc from "../bridge/ipc";

interface AppState {
  settings: AppSettings;
  notes: Note[];
  tags: Tag[];
  activeTab: Tab;
  searchQuery: string;
  selectedTagId: string | null;
  editorMode: EditorMode;
  showArchived: boolean;
  showDeleted: boolean;
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
};

export const useAppStore = create<AppState>((set, get) => ({
  settings: { ...defaults },
  notes: [],
  tags: [],
  activeTab: "notes",
  searchQuery: "",
  selectedTagId: null,
  editorMode: "edit",
  showArchived: false,
  showDeleted: false,
  loaded: false,

  loadAll: async () => {
    try {
      const [settings, notes, tags] = await Promise.all([
        ipc.getSettings(),
        ipc.getNotes(),
        ipc.getTags(),
      ]);
      set({ settings, notes, tags, loaded: true });
    } catch {
      set({ loaded: true });
    }
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
    const notes = get().notes.map((n) => n.id === id ? { ...n, archived: true } : n);
    set({ notes });
  },

  restoreArchive: async (id) => {
    await ipc.restoreArchive(id);
    const notes = get().notes.map((n) => n.id === id ? { ...n, archived: false } : n);
    set({ notes });
  },

  softDeleteNote: async (id) => {
    await ipc.softDeleteNote(id);
    const now = Date.now();
    const notes = get().notes.map((n) => n.id === id ? { ...n, deleted_at: now } : n);
    set({ notes });
  },

  restoreNote: async (id) => {
    await ipc.restoreNote(id);
    const notes = get().notes.map((n) => n.id === id ? { ...n, deleted_at: null, archived: false } : n);
    set({ notes });
  },

  purgeTrash: async () => {
    await ipc.purgeTrash();
    set({ notes: get().notes.filter((n) => n.deleted_at === null) });
  },
}));