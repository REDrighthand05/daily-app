import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import { Search, X } from "lucide-react";

export default function NoteSearch() {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className="search-bar">
      <Search size={14} className="search-icon" />
      <input
        type="text"
        placeholder={t("notes.search")}
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
