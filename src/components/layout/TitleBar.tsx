import { useTranslation } from "react-i18next";
import { useAppStore } from "../../stores/appStore";
import { Settings, StickyNote } from "lucide-react";
import type { Tab } from "../../types";

export default function TitleBar() {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useAppStore();

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "notes", icon: <StickyNote size={16} />, label: t("tabs.notes") },
    { id: "settings", icon: <Settings size={16} />, label: t("tabs.settings") },
  ];

  return (
    <div
      data-tauri-drag-region
      className="title-bar"
    >
      <div className="title-bar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`title-bar-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

