import { useAppStore } from "../../stores/appStore";
import type { AppSettings } from "../../types";
import { Sun, Moon, Monitor, Palette, AlignLeft, AlignRight } from "lucide-react";
import ThemePicker from "../theme/ThemePicker";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./LanguagePicker";
import CollapsibleSection from "../layout/CollapsibleSection";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();

  const themes: { value: AppSettings["theme"]; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun size={18} />, label: t("settings.light") },
    { value: "dark", icon: <Moon size={18} />, label: t("settings.dark") },
    { value: "system", icon: <Monitor size={18} />, label: t("settings.system") },
  ];

  const positions: { value: AppSettings["panel_position"]; icon: React.ReactNode; label: string }[] = [
    { value: "left", icon: <AlignLeft size={18} />, label: t("settings.left") },
    { value: "right", icon: <AlignRight size={18} />, label: t("settings.right") },
    { value: "float", icon: <Palette size={18} />, label: t("settings.float") },
  ];

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <CollapsibleSection title={t("settings.appearance")}>
        <h3>{t("settings.theme")}</h3>
        <div className="settings-options">
          {themes.map((t) => (
            <button
              key={t.value}
              className={`settings-option ${settings.theme === t.value ? "active" : ""}`}
              onClick={() => updateSettings({ theme: t.value })}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

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
              className={`settings-option ${settings.panel_position === p.value ? "active" : ""}`}
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
    </div>
  );
}
