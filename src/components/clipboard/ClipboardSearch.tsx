import { useAppStore } from "../../stores/appStore";
import { Search, X } from "lucide-react";

export default function ClipboardSearch() {
  const { clipboardSearchQuery, setClipboardSearchQuery } = useAppStore();

  return (
    <div className="cb-search">
      <Search size={14} className="cb-search-icon" />
      <input
        value={clipboardSearchQuery}
        onChange={(e) => setClipboardSearchQuery(e.target.value)}
        placeholder="Search clipboard..."
        className="cb-search-input"
      />
      {clipboardSearchQuery && (
        <button className="cb-search-clear" onClick={() => setClipboardSearchQuery("")}>
          <X size={12} />
        </button>
      )}
    </div>
  );
}