import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import { X } from "lucide-react";

export default function CategoryFilter() {
  const { t } = useTranslation();
  const { tags, notes, selectedTagId, setSelectedTagId } = useAppStore();

  const tagCounts = new Map<string, number>();
  notes.forEach((n) => n.tags.forEach((tId) => {
    tagCounts.set(tId, (tagCounts.get(tId) || 0) + 1);
  }));

  return (
    <div className="category-filter">
      <button
        className={`cat-filter-item ${!selectedTagId ? "active" : ""}`}
        onClick={() => setSelectedTagId(null)}
      >
        {t("notes.all")} ({notes.length})
      </button>
      {tags
        .filter((t) => (tagCounts.get(t.id) || 0) > 0)
        .map((tag) => (
          <button
            key={tag.id}
            className={`cat-filter-item ${selectedTagId === tag.id ? "active" : ""}`}
            onClick={() => setSelectedTagId(tag.id === selectedTagId ? null : tag.id)}
          >
            <span className="tag-dot-sm" style={{ backgroundColor: tag.color || "#888" }} />
            {tag.name} ({tagCounts.get(tag.id) || 0})
            {selectedTagId === tag.id && <X size={10} className="cat-filter-clear" />}
          </button>
        ))}
    </div>
  );
}