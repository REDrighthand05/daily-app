use tauri::State;
use crate::settings::{AppSettings, SettingsStore};

#[tauri::command]
pub fn get_settings(store: State<SettingsStore>) -> Result<AppSettings, String> {
    let settings = store.settings.lock().map_err(|e| e.to_string())?;
    Ok(settings.clone())
}

#[tauri::command]
pub fn save_settings(store: State<SettingsStore>, settings: AppSettings) -> Result<(), String> {
    {
        let mut current = store.settings.lock().map_err(|e| e.to_string())?;
        *current = settings;
    }
    store.save()
}
