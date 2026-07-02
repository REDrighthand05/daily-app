use tauri::State;
use crate::db::notes::{Note, NotesStore};

#[tauri::command]
pub fn get_notes(store: State<NotesStore>) -> Result<Vec<Note>, String> {
    let notes = store.notes.lock().map_err(|e| e.to_string())?;
    Ok(notes.clone())
}

#[tauri::command]
pub fn save_note(store: State<NotesStore>, note: Note) -> Result<(), String> {
    {
        let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
        if let Some(existing) = notes.iter_mut().find(|n| n.id == note.id) {
            *existing = note;
        } else {
            notes.insert(0, note);
        }
    }
    store.save()
}

#[tauri::command]
pub fn delete_note(store: State<NotesStore>, id: String) -> Result<(), String> {
    {
        let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
        notes.retain(|n| n.id != id);
    }
    store.save()
}

#[tauri::command]
pub fn archive_note(store: State<NotesStore>, id: String) -> Result<(), String> {
    let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
    if let Some(note) = notes.iter_mut().find(|n| n.id == id) {
        note.archived = true;
    }
    drop(notes);
    store.save()
}

#[tauri::command]
pub fn restore_archive(store: State<NotesStore>, id: String) -> Result<(), String> {
    let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
    if let Some(note) = notes.iter_mut().find(|n| n.id == id) {
        note.archived = false;
    }
    drop(notes);
    store.save()
}

#[tauri::command]
pub fn soft_delete_note(store: State<NotesStore>, id: String) -> Result<(), String> {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis() as u64;
    let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
    if let Some(note) = notes.iter_mut().find(|n| n.id == id) {
        note.deleted_at = Some(now);
    }
    drop(notes);
    store.save()
}

#[tauri::command]
pub fn restore_note(store: State<NotesStore>, id: String) -> Result<(), String> {
    let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
    if let Some(note) = notes.iter_mut().find(|n| n.id == id) {
        note.deleted_at = None;
        note.archived = false;
    }
    drop(notes);
    store.save()
}

#[tauri::command]
pub fn purge_trash(store: State<NotesStore>) -> Result<(), String> {
    let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
    notes.retain(|n| n.deleted_at.is_none());
    drop(notes);
    store.save()
}
#[tauri::command]
pub fn move_note(store: State<NotesStore>, id: String, direction: String) -> Result<(), String> {
    let mut notes = store.notes.lock().map_err(|e| e.to_string())?;
    let idx = notes.iter().position(|n| n.id == id).ok_or("note not found")?;
    match direction.as_str() {
        "up" if idx > 0 => notes.swap(idx, idx - 1),
        "down" if idx < notes.len() - 1 => notes.swap(idx, idx + 1),
        _ => {}
    }
    drop(notes);
    store.save()
}