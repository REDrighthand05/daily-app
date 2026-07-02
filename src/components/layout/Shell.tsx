import TitleBar from "./TitleBar";
import NoteList from "../notes/NoteList";
import NoteEditor from "../notes/NoteEditor";
import NoteSearch from "../notes/NoteSearch";
import SettingsPage from "../settings/SettingsPage";
import { useAppStore } from "../../stores/appStore";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

export default function Shell() {
  const { activeTab, loadAll, setActiveTab } = useAppStore();

  useEffect(() => {
    loadAll();
    const unlisten = listen<string>("navigate", (event) => {
      if (event.payload === "settings") setActiveTab("settings");
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <div className="app-container">
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
      {activeTab === "settings" && <SettingsPage />}
    </div>
  );
}
