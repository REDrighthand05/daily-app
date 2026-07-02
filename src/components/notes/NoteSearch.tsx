import { useAppStore } from "../../stores/appStore";
import { Search, X } from "lucide-react";

export default function NoteSearch() {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className="search-bar">
      <Search size={14} className="search-icon" />
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="search-clear" onClick={() => setSearchQuery("")}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
