import { useAppStore } from "../../stores/appStore";
import type { AppSettings } from "../../types";
import { Sun, Moon, Monitor, Palette, AlignLeft, AlignRight } from "lucide-react";
import ThemePicker from "../theme/ThemePicker";
import CollapsibleSection from "../layout/CollapsibleSection";

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore();

  const themes: { value: AppSettings["theme"]; icon: React.ReactNode; label: string }[] = [
    { value: "light", icon: <Sun size={18} />, label: "Light" },
    { value: "dark", icon: <Moon size={18} />, label: "Dark" },
    { value: "system", icon: <Monitor size={18} />, label: "System" },
  ];

  const positions: { value: AppSettings["panel_position"]; icon: React.ReactNode; label: string }[] = [
    { value: "left", icon: <AlignLeft size={18} />, label: "Left" },
    { value: "right", icon: <AlignRight size={18} />, label: "Right" },
    { value: "float", icon: <Palette size={18} />, label: "Float" },
  ];

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <CollapsibleSection title="Appearance">
        <h3>Theme</h3>
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

        <h3>Accent Color</h3>
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
          <span>Enable animations</span>
        </label>
      </CollapsibleSection>

      <CollapsibleSection title="Panel">
        <h3>Panel Position</h3>
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
        <h3>Opacity</h3>
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
        <h3>Autostart</h3>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={settings.autostart}
            onChange={(e) => updateSettings({ autostart: e.target.checked })}
          />
          <span>Start with Windows</span>
        </label>
      </section>

      <section>
        <h3>Shortcut</h3>
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
