import type { Tag } from "../../types";
import { X } from "lucide-react";

interface Props {
  tag: Tag;
  onRemove?: () => void;
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function TagChip({ tag, onRemove, onClick, size = "md" }: Props) {
  return (
    <span
      className={`tag-chip ${size}`}
      style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
      onClick={onClick}
    >
      <span
        className="tag-dot"
        style={{ backgroundColor: tag.color || "#888" }}
      />
      {tag.name}
      {onRemove && (
        <button className="tag-remove" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Remove tag">
          <X size={10} />
        </button>
      )}
    </span>
  );
}