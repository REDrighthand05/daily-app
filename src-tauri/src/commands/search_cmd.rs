use serde::Serialize;
use tauri::State;
use crate::db::notes::NotesStore;
use crate::db::clipboard::ClipboardStore;

#[derive(Debug, Clone, Serialize)]
pub struct SearchResultItem {
    pub id: String,
    pub source: String,
    pub title: String,
    pub snippet: String,
    pub timestamp: u64,
}

#[tauri::command]
pub fn global_search(
    notes_store: State<NotesStore>,
    clipboard_store: State<ClipboardStore>,
    query: String,
) -> Result<Vec<SearchResultItem>, String> {
    let q = query.to_lowercase();
    let mut results = Vec::new();

    let notes = notes_store.notes.lock().map_err(|e| e.to_string())?;
    for note in notes.iter() {
        if note.content.to_lowercase().contains(&q) {
            let title = note.content.lines().next().unwrap_or("").to_string();
            let snippet: String = note.content.chars().take(120).collect();
            results.push(SearchResultItem {
                id: note.id.clone(),
                source: "note".into(),
                title,
                snippet,
                timestamp: note.updated_at,
            });
        }
    }

    let entries = clipboard_store.entries.lock().map_err(|e| e.to_string())?;
    for entry in entries.iter() {
        if entry.content.to_lowercase().contains(&q) {
            let title: String = entry.content.chars().take(60).collect();
            let snippet: String = entry.content.chars().take(120).collect();
            results.push(SearchResultItem {
                id: entry.id.clone(),
                source: "clipboard".into(),
                title,
                snippet,
                timestamp: entry.created_at,
            });
        }
    }

    results.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    Ok(results)
}