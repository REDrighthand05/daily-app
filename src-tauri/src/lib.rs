use tauri::{
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager, WindowEvent,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};
use std::str::FromStr;
use std::sync::{Arc, Mutex};
use std::time::Instant;

mod settings;
mod db;
mod commands;

mod platform;
mod window;

use settings::SettingsStore;
use db::notes::NotesStore;
use db::clipboard::ClipboardStore;
use db::tags::TagsStore;
use commands::{settings_cmd, notes_cmd, tags_cmd, markdown_cmd, export_cmd, clipboard_cmd, search_cmd, backup_cmd, diagnostics_cmd};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let settings_store = SettingsStore::new();
    let settings = settings_store.settings.lock().unwrap().clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(Default::default(), None))
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, event| {
                    if event.state == ShortcutState::Pressed {
                        if let Some(window) = app.get_webview_window("main") {
                            if window.is_visible().unwrap_or(false) {
                                let _ = window.hide();
                            } else {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .build(),
        )
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .manage(settings_store)
        .manage(NotesStore::new())
        .manage(TagsStore::new())
        .manage(ClipboardStore::new())
        .setup(move |app| {
            let show_item = MenuItemBuilder::with_id("show", "Show").build(app)?;
            let settings_item = MenuItemBuilder::with_id("settings", "Settings").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            let menu = MenuBuilder::new(app)
                .items(&[&show_item, &settings_item, &quit_item])
                .build()?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("Daily")
                .menu(&menu)
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => {
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.show();
                            let _ = w.set_focus();
                        }
                    }
                    "settings" => {
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.show();
                            let _ = w.set_focus();
                            let _ = w.emit("navigate", "settings");
                        }
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(w) = app.get_webview_window("main") {
                            if w.is_visible().unwrap_or(false) {
                                let _ = w.hide();
                            } else {
                                let _ = w.show();
                                let _ = w.set_focus();
                            }
                        }
                    }
                })
                .build(app)?;

            register_shortcut(app, &settings.shortcut_toggle);

            if let Some(window) = app.get_webview_window("main") {
                position_panel(&window, &settings);
                let alpha = (settings.opacity * 255.0) as u8;
                if settings.theme == "light" {
                    let _ = window.set_background_color(Some((255, 255, 255, alpha).into()));
                } else {
                    let _ = window.set_background_color(Some((0, 0, 0, alpha).into()));
                }

                let handle = app.handle().clone();
                let last_focus_lost = Arc::new(Mutex::new(None::<Instant>));
                let flag = last_focus_lost.clone();
                window.on_window_event(move |event| {
                    match event {
                        WindowEvent::Focused(false) => {
                            let ts = Instant::now();
                            *last_focus_lost.lock().unwrap() = Some(ts);
                            let h = handle.clone();
                            let f = flag.clone();
                            std::thread::spawn(move || {
                                std::thread::sleep(std::time::Duration::from_millis(300));
                                if *f.lock().unwrap() == Some(ts) {
                                    if let Some(w) = h.get_webview_window("main") {
                                        let _ = w.hide();
                                    }
                                }
                            });
                        }
                        WindowEvent::Focused(true) => {
                            *last_focus_lost.lock().unwrap() = None;
                        }
                        _ => {}
                    }
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            settings_cmd::get_settings,
            settings_cmd::save_settings,
            notes_cmd::get_notes,
            notes_cmd::save_note,
            notes_cmd::archive_note,
            notes_cmd::restore_archive,
            notes_cmd::soft_delete_note,
            notes_cmd::restore_note,
            notes_cmd::purge_trash,
            notes_cmd::move_note,
            clipboard_cmd::clipboard_poll,
            clipboard_cmd::get_clipboard_entries,
            clipboard_cmd::delete_clipboard_entry,
            clipboard_cmd::clear_clipboard_history,
            clipboard_cmd::star_clipboard_entry,
            clipboard_cmd::write_clipboard,
            clipboard_cmd::move_clipboard_entry,
            search_cmd::global_search,
            backup_cmd::export_backup,
            backup_cmd::import_backup,
            backup_cmd::factory_reset,
            diagnostics_cmd::get_system_info,
            diagnostics_cmd::create_issue_report,
            notes_cmd::delete_note,
            tags_cmd::get_tags,
            tags_cmd::save_tag,
            tags_cmd::delete_tag,
            tags_cmd::filter_notes_by_tag,
            markdown_cmd::render_markdown,
            export_cmd::write_file,
            export_cmd::batch_export,
            window::set_window_opacity,
            window::set_window_position,
            window::detach_window,
            window::attach_window,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn register_shortcut(app: &tauri::App, shortcut_str: &str) {
    let parts: Vec<&str> = shortcut_str.split('+').collect();
    if parts.len() < 2 {
        return;
    }
    let mod_str = parts[0];
    let key_str = parts[1];

    let code = match key_str.to_lowercase().as_str() {
        "space" => Code::Space,
        "enter" => Code::Enter,
        "tab" => Code::Tab,
        "escape" => Code::Escape,
        "backspace" => Code::Backspace,
        "delete" => Code::Delete,
        "f1" => Code::F1,
        "f2" => Code::F2,
        "f3" => Code::F3,
        "f4" => Code::F4,
        "f5" => Code::F5,
        "f6" => Code::F6,
        "f7" => Code::F7,
        "f8" => Code::F8,
        "f9" => Code::F9,
        "f10" => Code::F10,
        "f11" => Code::F11,
        "f12" => Code::F12,
        c if c.len() == 1 => Code::from_str(c).unwrap_or(Code::Space),
        _ => Code::Space,
    };

    let modifier = match mod_str.to_lowercase().as_str() {
        "alt" => Modifiers::ALT,
        "ctrl" => Modifiers::CONTROL,
        "shift" => Modifiers::SHIFT,
        "meta" | "win" | "super" => Modifiers::SUPER,
        _ => Modifiers::ALT,
    };

    let _ = app.global_shortcut().unregister_all();
    let _ = app.global_shortcut().register(Shortcut::new(Some(modifier), code));
}

fn position_panel(window: &tauri::WebviewWindow, settings: &settings::AppSettings) {
    let Ok(Some(monitor)) = window.primary_monitor() else { return };
    let monitor_size = monitor.size();
    let scale = monitor.scale_factor();
    let w = (settings.window_width as f64 * scale) as u32;
    let h = (settings.window_height as f64 * scale) as u32;

    match settings.panel_position.as_str() {
        "right" => {
            let x = monitor_size.width.saturating_sub(w);
            let y = (monitor_size.height.saturating_sub(h)) / 2;
            let _ = window.set_position(tauri::PhysicalPosition::new(x as i32, y as i32));
        }
        "left" => {
            let y = (monitor_size.height.saturating_sub(h)) / 2;
            let _ = window.set_position(tauri::PhysicalPosition::new(0, y as i32));
        }
        _ => {}
    }
    let _ = window.set_size(tauri::PhysicalSize::new(w, h));
}