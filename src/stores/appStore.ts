import { create } from "zustand";
import type { AppSettings, Note, Tab } from "../types";
import * as ipc from "../bridge/ipc";

interface AppState {
  settings: AppSettings;
  notes: Note[];
  activeTab: Tab;
  searchQuery: string;
  loaded: boolean;

  loadAll: () => Promise<void>;
  updateSettings: (s: Partial<AppSettings>) => Promise<void>;
  setNotes: (notes: Note[]) => void;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setActiveTab: (tab: Tab) => void;
  setSearchQuery: (q: string) => void;
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

export const useAppStore = create<AppState>((set, get) => ({
  settings: { ...defaults },
  notes: [],
  activeTab: "notes",
  searchQuery: "",
  loaded: false,

  loadAll: async () => {
    try {
      const [settings, notes] = await Promise.all([
        ipc.getSettings(),
        ipc.getNotes(),
      ]);
      set({ settings, notes, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  updateSettings: async (partial) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    await ipc.saveSettings(updated);
    set({ settings: updated });

    // Call window IPC for real-time effects
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
}));