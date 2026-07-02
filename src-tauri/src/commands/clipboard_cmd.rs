use tauri::State;
use crate::db::clipboard::{ClipboardEntry, ClipboardStore};
use sha2::{Sha256, Digest};
use std::time::{SystemTime, UNIX_EPOCH};
use std::sync::atomic::{AtomicU64, Ordering};

static CLIP_ID_COUNTER: AtomicU64 = AtomicU64::new(0);

fn generate_id() -> String {
    let us = SystemTime::now()
        .duration_since(UNIX_EPOCH).unwrap_or_default()
        .as_micros();
    let c = CLIP_ID_COUNTER.fetch_add(1, Ordering::Relaxed);
    format!("clip{:x}_{:x}", us, c)
}

#[tauri::command]
pub fn clipboard_poll(store: State<ClipboardStore>) -> Result<Option<ClipboardEntry>, String> {
    let mut clipboard = match arboard::Clipboard::new() {
        Ok(cb) => cb,
        Err(_) => return Ok(None),
    };

    let text = match clipboard.get_text() {
        Ok(t) => t,
        Err(_) => return Ok(None),
    };

    let mut hasher = Sha256::new();
    hasher.update(text.as_bytes());
    let hash = format!("{:x}", hasher.finalize());

    let mut entries = store.entries.lock().map_err(|e| e.to_string())?;

    if entries.iter().any(|e| e.content_hash == hash) {
        return Ok(None);
    }

    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH).unwrap_or_default()
        .as_millis() as u64;

    let entry = ClipboardEntry {
        id: generate_id(),
        content: text,
        content_type: "text".into(),
        content_hash: hash,
        created_at: now,
        starred: false,
    };

    entries.insert(0, entry.clone());
    if entries.len() > 500 { entries.truncate(500); }
    drop(entries);
    store.save()?;
    Ok(Some(entry))
}

#[tauri::command]
pub fn get_clipboard_entries(store: State<ClipboardStore>) -> Result<Vec<ClipboardEntry>, String> {
    let entries = store.entries.lock().map_err(|e| e.to_string())?;
    Ok(entries.clone())
}

#[tauri::command]
pub fn delete_clipboard_entry(store: State<ClipboardStore>, id: String) -> Result<(), String> {
    let mut entries = store.entries.lock().map_err(|e| e.to_string())?;
    entries.retain(|e| e.id != id);
    drop(entries);
    store.save()
}

#[tauri::command]
pub fn clear_clipboard_history(store: State<ClipboardStore>) -> Result<(), String> {
    let mut entries = store.entries.lock().map_err(|e| e.to_string())?;
    entries.clear();
    drop(entries);
    store.save()
}

#[tauri::command]
pub fn star_clipboard_entry(store: State<ClipboardStore>, id: String, starred: bool) -> Result<(), String> {
    let mut entries = store.entries.lock().map_err(|e| e.to_string())?;
    if let Some(entry) = entries.iter_mut().find(|e| e.id == id) {
        entry.starred = starred;
    }
    drop(entries);
    store.save()
}
#[tauri::command]
pub fn write_clipboard(content: String) -> Result<(), String> {
    let mut clipboard = arboard::Clipboard::new().map_err(|e| format!("clipboard error: {}", e))?;
    clipboard.set_text(content).map_err(|e| format!("write error: {}", e))
}
#[tauri::command]
pub fn move_clipboard_entry(store: State<ClipboardStore>, id: String, direction: String) -> Result<(), String> {
    let mut entries = store.entries.lock().map_err(|e| e.to_string())?;
    let idx = entries.iter().position(|e| e.id == id).ok_or("entry not found")?;
    match direction.as_str() {
        "up" if idx > 0 => entries.swap(idx, idx - 1),
        "down" if idx < entries.len() - 1 => entries.swap(idx, idx + 1),
        _ => {}
    }
    drop(entries);
    store.save()
}