use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(default = "default_theme")]
    pub theme: String,
    #[serde(default = "default_panel_position")]
    pub panel_position: String,
    #[serde(default = "default_opacity")]
    pub opacity: f64,
    #[serde(default = "default_autostart")]
    pub autostart: bool,
    #[serde(default = "default_shortcut")]
    pub shortcut_toggle: String,
    #[serde(default = "default_width")]
    pub window_width: u32,
    #[serde(default = "default_height")]
    pub window_height: u32,
    #[serde(default = "default_archive_days")]
    pub archive_days: u32,
    #[serde(default = "default_clipboard_enabled")]
    pub clipboard_enabled: bool,
    #[serde(default = "default_clipboard_max")]
    pub clipboard_max_entries: u32,
    #[serde(default = "default_accent_color")]
    pub accent_color: String,
    #[serde(default = "default_animations_enabled")]
    pub animations_enabled: bool,
}

fn default_theme() -> String { "system".into() }
fn default_panel_position() -> String { "right".into() }
fn default_opacity() -> f64 { 0.85 }
fn default_autostart() -> bool { false }
fn default_shortcut() -> String { "Alt+Space".into() }
fn default_width() -> u32 { 360 }
fn default_height() -> u32 { 720 }
fn default_archive_days() -> u32 { 30 }
fn default_clipboard_enabled() -> bool { true }
fn default_clipboard_max() -> u32 { 500 }
fn default_accent_color() -> String { "#4F8CFF".into() }
fn default_animations_enabled() -> bool { true }

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            theme: default_theme(),
            panel_position: default_panel_position(),
            opacity: default_opacity(),
            autostart: default_autostart(),
            shortcut_toggle: default_shortcut(),
            window_width: default_width(),
            window_height: default_height(),
            archive_days: default_archive_days(),
            clipboard_enabled: default_clipboard_enabled(),
            clipboard_max_entries: default_clipboard_max(),
            accent_color: default_accent_color(),
            animations_enabled: default_animations_enabled(),
        }
    }
}

pub struct SettingsStore {
    pub settings: Mutex<AppSettings>,
    config_path: PathBuf,
}

impl SettingsStore {
    pub fn new() -> Self {
        let config_path = Self::config_path();
        let settings = Self::load_from_file(&config_path).unwrap_or_default();
        Self {
            settings: Mutex::new(settings),
            config_path,
        }
    }

    fn config_path() -> PathBuf {
        let base = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."));
        base.join("daily").join("settings.json")
    }

    fn load_from_file(path: &PathBuf) -> Option<AppSettings> {
        let data = fs::read_to_string(path).ok()?;
        serde_json::from_str(&data).ok()
    }

    pub fn save(&self) -> Result<(), String> {
        let settings = self.settings.lock().map_err(|e| e.to_string())?;
        if let Some(parent) = self.config_path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let data = serde_json::to_string_pretty(&*settings).map_err(|e| e.to_string())?;
        fs::write(&self.config_path, data).map_err(|e| e.to_string())
    }
}
