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
            notes.push(note);
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
