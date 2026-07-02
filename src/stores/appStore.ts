import { create } from "zustand";
import type { AppSettings, Note, Tab, Tag } from "../types";
import * as ipc from "../bridge/ipc";

interface AppState {
  settings: AppSettings;
  notes: Note[];
  tags: Tag[];
  activeTab: Tab;
  searchQuery: string;
  selectedTagId: string | null;
  loaded: boolean;

  loadAll: () => Promise<void>;
  updateSettings: (s: Partial<AppSettings>) => Promise<void>;
  setNotes: (notes: Note[]) => void;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setActiveTab: (tab: Tab) => void;
  setSearchQuery: (q: string) => void;

  // Tags
  loadTags: () => Promise<void>;
  saveTag: (tag: Tag) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  setSelectedTagId: (id: string | null) => void;
}

const defaults: AppSettings = {
  theme: "system",
  panel_position: "right",
  opacity: 0.85,
  autostart: false,
  shortcut_toggle: "Alt+Space",
  window_width: 360,
  window_height: 720,
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: { ...defaults },
  notes: [],
  tags: [],
  activeTab: "notes",
  searchQuery: "",
  selectedTagId: null,
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

  // Tags
  loadTags: async () => {
    try {
      const tags = await ipc.getTags();
      set({ tags });
    } catch {
      // ignore
    }
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
}));