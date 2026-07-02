import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import { globalSearch } from "../../bridge/ipc";
import type { SearchResultItem } from "../../types";
import { Search, FileText, Clipboard, X } from "lucide-react";

export default function SearchOverlay() {
  const { t } = useTranslation();
  const {
    globalSearchOpen, globalSearchQuery, globalSearchResults,
    closeGlobalSearch, setGlobalSearchQuery, setGlobalSearchResults, setActiveTab,
  } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!globalSearchOpen) return;
    setSelectedIdx(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [globalSearchOpen]);

  useEffect(() => {
    if (!globalSearchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeGlobalSearch(); return; }
      if (e.key === "ArrowDown") {
        setSelectedIdx((i) => Math.min(i + 1, globalSearchResults.length - 1));
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        setSelectedIdx((i) => Math.max(i - 1, 0));
        e.preventDefault();
      }
      if (e.key === "Enter" && globalSearchResults[selectedIdx]) {
        navigate(globalSearchResults[selectedIdx]);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [globalSearchOpen, globalSearchResults, selectedIdx]);

  if (!globalSearchOpen) return null;

  const doSearch = (q: string) => {
    setGlobalSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setGlobalSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await globalSearch(q);
      setGlobalSearchResults(results);
    }, 250);
  };

  const navigate = (item: SearchResultItem) => {
    closeGlobalSearch();
    if (item.source === "note") setActiveTab("notes");
    else if (item.source === "clipboard") setActiveTab("clipboard");
  };

  const noteResults = globalSearchResults.filter((r) => r.source === "note");
  const clipResults = globalSearchResults.filter((r) => r.source === "clipboard");

  return (
    <div className="search-overlay" onClick={closeGlobalSearch}>
      <div className="search-overlay-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-overlay-input-wrap">
          <Search size={16} className="search-overlay-icon" />
          <input
            ref={inputRef}
            className="search-overlay-input"
            value={globalSearchQuery}
            onChange={(e) => doSearch(e.target.value)}
            placeholder={t("search.placeholder")}
          />
          <button className="search-overlay-close" onClick={closeGlobalSearch}>
            <X size={16} />
          </button>
        </div>
        <div className="search-overlay-results">
          {noteResults.length > 0 && (
            <div className="search-group">
              <div className="search-group-title">
                <FileText size={12} /> {t("search.notes", { count: noteResults.length })}
              </div>
              {noteResults.map((r, i) => (
                <div
                  key={r.id}
                  className={`search-result-item ${selectedIdx === i ? "selected" : ""}`}
                  onClick={() => navigate(r)}
                >
                  <div className="search-result-title">{r.title || "Untitled"}</div>
                  <div className="search-result-snippet">{r.snippet}</div>
                </div>
              ))}
            </div>
          )}
          {clipResults.length > 0 && (
            <div className="search-group">
              <div className="search-group-title">
                <Clipboard size={12} /> {t("search.clipboard", { count: clipResults.length })}
              </div>
              {clipResults.map((r, i) => (
                <div
                  key={r.id}
                  className={`search-result-item ${selectedIdx === noteResults.length + i ? "selected" : ""}`}
                  onClick={() => navigate(r)}
                >
                  <div className="search-result-title">{r.title}</div>
                  <div className="search-result-snippet">{r.snippet}</div>
                </div>
              ))}
            </div>
          )}
          {globalSearchQuery.length >= 2 && globalSearchResults.length === 0 && (
            <div className="search-no-results">{t("search.noResults")}</div>
          )}
        </div>
      </div>
    </div>
  );
}