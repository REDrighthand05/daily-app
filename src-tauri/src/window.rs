use tauri::WebviewWindow;
use crate::settings::SettingsStore;

#[tauri::command]
pub fn set_window_opacity(
    window: WebviewWindow,
    store: tauri::State<SettingsStore>,
    opacity: f64,
    is_dark: bool,
) -> Result<(), String> {
    let clamped = opacity.clamp(0.3, 1.0);
    let alpha = (clamped * 255.0) as u8;
    if is_dark {
        let _ = window.set_background_color(Some((0, 0, 0, alpha).into()));
    } else {
        let _ = window.set_background_color(Some((255, 255, 255, alpha).into()));
    }
    {
        let mut settings = store.settings.lock().map_err(|e| e.to_string())?;
        settings.opacity = clamped;
    }
    store.save()
}

#[tauri::command]
pub fn set_window_position(
    window: WebviewWindow,
    store: tauri::State<SettingsStore>,
    position: String,
) -> Result<(), String> {
    {
        let mut settings = store.settings.lock().map_err(|e| e.to_string())?;
        settings.panel_position = position.clone();
    }
    store.save()?;

    let settings = store.settings.lock().map_err(|e| e.to_string())?;
    let Ok(Some(monitor)) = window.primary_monitor() else {
        return Err("no monitor".into());
    };
    let monitor_size = monitor.size();
    let scale = monitor.scale_factor();
    let w = (settings.window_width as f64 * scale) as u32;
    let h = (settings.window_height as f64 * scale) as u32;

    match position.as_str() {
        "right" => {
            let _ = window.set_decorations(false);
            let _ = window.set_skip_taskbar(true);
            let x = monitor_size.width.saturating_sub(w);
            let y = (monitor_size.height.saturating_sub(h)) / 2;
            let _ = window.set_position(tauri::PhysicalPosition::new(x as i32, y as i32));
            let _ = window.set_size(tauri::PhysicalSize::new(w, h));
        }
        "left" => {
            let _ = window.set_decorations(false);
            let _ = window.set_skip_taskbar(true);
            let y = (monitor_size.height.saturating_sub(h)) / 2;
            let _ = window.set_position(tauri::PhysicalPosition::new(0, y as i32));
            let _ = window.set_size(tauri::PhysicalSize::new(w, h));
        }
        _ => {
            let _ = window.set_decorations(true);
            let _ = window.set_skip_taskbar(false);
            let _ = window.set_size(tauri::PhysicalSize::new(w, h));
        }
    }
    Ok(())
}

#[tauri::command]
pub fn detach_window(window: WebviewWindow) -> Result<(), String> {
    let _ = window.set_decorations(true);
    let _ = window.set_skip_taskbar(false);
    Ok(())
}

#[tauri::command]
pub fn attach_window(window: WebviewWindow) -> Result<(), String> {
    let _ = window.set_decorations(false);
    let _ = window.set_skip_taskbar(true);
    Ok(())
}