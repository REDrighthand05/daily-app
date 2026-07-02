import { useState } from "react";
import TagChip from "./TagChip";
import { useAppStore } from "../../stores/appStore";
import type { Tag } from "../../types";
import { Plus } from "lucide-react";

interface Props {
  onToggle: (tagId: string) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function TagPicker({ onToggle }: Props) {
  const { tags, saveTag } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    const tag: Tag = { id: generateId(), name, color: undefined };
    await saveTag(tag);
    setNewName("");
    setShowAdd(false);
  };

  return (
    <div className="tag-picker">
      <div className="tag-picker-chips">
        {tags.map((tag) => (
          <TagChip
            key={tag.id}
            tag={tag}
            onClick={() => onToggle(tag.id)}
            size="sm"
          />
        ))}
        <button className="tag-add-btn" onClick={() => setShowAdd(!showAdd)} title="New tag">
          <Plus size={12} />
        </button>
      </div>
      {showAdd && (
        <div className="tag-picker-input">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="Tag name..."
          />
        </div>
      )}
    </div>
  );
}