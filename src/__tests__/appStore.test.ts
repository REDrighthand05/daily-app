import { describe, it, expect } from "vitest";
import { useAppStore } from "../stores/appStore";

describe("appStore", () => {
  it("should have initial empty notes", () => {
    const { notes } = useAppStore.getState();
    expect(notes).toEqual([]);
  });

  it("should set notes correctly", () => {
    const mockNotes = [
      { id: "1", content: "Test 1", created_at: 1, updated_at: 1, pinned: false, tags: [], category: null, archived: false, deleted_at: null },
      { id: "2", content: "Test 2", created_at: 2, updated_at: 2, pinned: true, tags: [], category: null, archived: false, deleted_at: null },
      { id: "3", content: "Test 3", created_at: 3, updated_at: 3, pinned: false, tags: [], category: null, archived: false, deleted_at: null },
    ];
    useAppStore.getState().setNotes(mockNotes);
    const notes = useAppStore.getState().notes;
    expect(notes).toHaveLength(3);
    expect(notes[0].content).toBe("Test 1");
  });
});