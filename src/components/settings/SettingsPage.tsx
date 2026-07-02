import { useAppStore } from "../../stores/appStore";
import type { AppSettings } from "../../types";
import { Palette, AlignLeft, AlignRight } from "lucide-react";
import ThemePicker from "../theme/ThemePicker";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./LanguagePicker";
import { exportBackup, importBackup, factoryReset, getSystemInfo, createIssueReport } from "../../bridge/ipc";
import type { SystemInfo } from "../../types";
import CollapsibleSection from "../layout/CollapsibleSection";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const { settings, updateSettings, loadAll } = useAppStore();

  useEffect(() => { getSystemInfo().then(setSysInfo).catch(() => {}); }, []);

  const handleExport = async () => {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const p = await save({ filters: [{ name: "Backup", extensions: ["zip"] }], defaultPath: "daily-backup.zip" });
    if (p) await exportBackup(p);
  };
  const handleImport = async () => {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const p = await open({ filters: [{ name: "Backup", extensions: ["zip"] }] });
    if (p) { await importBackup(p); await loadAll(); }
  };
  const handleReportIssue = async () => {
    const d = prompt("Describe the issue:");
    if (d && sysInfo) {
      const p = await createIssueReport(sysInfo, d);
      alert("Report saved to:\n" + p);
    }
  };

  const handleReset = async () => {
    if (confirm("Delete all data?")) { await factoryReset(); await loadAll(); }
  };

  const positions: { value: AppSettings["panel_position"]; icon: React.ReactNode; label: string }[] = [
    { value: "left", icon: <AlignLeft size={18} />, label: t("settings.left") },
    { value: "right", icon: <AlignRight size={18} />, label: t("settings.right") },
    { value: "float", icon: <Palette size={18} />, label: t("settings.float") },
  ];

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <CollapsibleSection title={t("settings.appearance")}>
        <h3>{t("settings.accentColor")}</h3>
        <ThemePicker
          accentColor={settings.accent_color}
          onChange={(color) => updateSettings({ accent_color: color })}
        />

        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.animations_enabled}
            onChange={(e) => updateSettings({ animations_enabled: e.target.checked })}
          />
          <span>{t("settings.animations")}</span>
        </label>
        <h3>{t("settings.language")}</h3>
        <LanguagePicker />
      </CollapsibleSection>

      <CollapsibleSection title={t("settings.panel")}>
        <h3>{t("settings.position")}</h3>
        <div className="settings-options">
          {positions.map((p) => (
            <button
              key={p.value}
              className={settings-option }
              onClick={() => updateSettings({ panel_position: p.value })}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>
        <h3>{t("settings.opacity")}</h3>
        <div className="settings-slider">
          <input
            type="range"
            min="30"
            max="100"
            value={Math.round(settings.opacity * 100)}
            onChange={(e) =>
              updateSettings({ opacity: parseInt(e.target.value) / 100 })
            }
          />
          <span>{Math.round(settings.opacity * 100)}%</span>
        </div>
      </CollapsibleSection>

      <section>
        <h3>{t("settings.autostart")}</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.autostart}
            onChange={(e) => updateSettings({ autostart: e.target.checked })}
          />
          <span>{t("settings.startWithWindows")}</span>
        </label>
      </section>

      <section>
        <h3>{t("settings.shortcut")}</h3>
        <input
          className="settings-shortcut"
          type="text"
          value={settings.shortcut_toggle}
          readOnly
          placeholder="Alt+Space"
        />
      </section>
          <section>
        <h3>Diagnostics</h3>
        <div className="diagnostics-info">
          <p>OS: {sysInfo?.os} ({sysInfo?.arch})</p>
          <p>App: v{sysInfo?.app_version}</p>
          <button className="settings-action-btn" onClick={handleReportIssue}>Report Issue</button>
        </div>
      </section>

      <section>
        <h3>Data</h3>
        <div className="settings-actions">
          <button className="settings-action-btn" onClick={handleExport}>Export Backup</button>
          <button className="settings-action-btn" onClick={handleImport}>Import Backup</button>
          <button className="settings-action-btn danger" onClick={handleReset}>Factory Reset</button>
        </div>
      </section>
    </div>
  );
}
