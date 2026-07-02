import TitleBar from "./TitleBar";
import NoteList from "../notes/NoteList";
import NoteEditor from "../notes/NoteEditor";
import NoteSearch from "../notes/NoteSearch";
import SettingsPage from "../settings/SettingsPage";
import ClipboardList from "../clipboard/ClipboardList";
import SearchOverlay from "../search/SearchOverlay";
import { useAppStore } from "../../stores/appStore";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { FileText, Clipboard, Settings } from "lucide-react";

export default function Shell() {
  const { activeTab, loadAll, setActiveTab, openGlobalSearch } = useAppStore();

  useEffect(() => {
    loadAll();
    const unlisten = listen<string>("navigate", (event) => {
      if (event.payload === "settings") setActiveTab("settings");
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

    useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key === "f")) {
        e.preventDefault();
        openGlobalSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="app-container">
      <SearchOverlay />
      <TitleBar />
      {activeTab === "notes" && (
        <div className="notes-panel">
          <NoteSearch />
          <div className="notes-body">
            <NoteList />
            <NoteEditor />
          </div>
        </div>
      )}
      {activeTab === "clipboard" && <ClipboardList />}
      {activeTab === "settings" && <SettingsPage />}
      <div className="tab-bar">
        <button
          className={`tab-bar-btn ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <FileText size={14} /> Notes
        </button>
        <button
          className={`tab-bar-btn ${activeTab === "clipboard" ? "active" : ""}`}
          onClick={() => setActiveTab("clipboard")}
        >
          <Clipboard size={14} /> Clipboard
        </button>
        <button
          className={`tab-bar-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings size={14} /> Settings
        </button>
      </div>
    </div>
  );
}