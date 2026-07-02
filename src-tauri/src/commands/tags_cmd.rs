use tauri::State;
use crate::db::tags::{Tag, TagsStore};
use crate::db::notes::{Note, NotesStore};

#[tauri::command]
pub fn get_tags(store: State<TagsStore>) -> Result<Vec<Tag>, String> {
    let tags = store.tags.lock().map_err(|e| e.to_string())?;
    Ok(tags.clone())
}

#[tauri::command]
pub fn save_tag(store: State<TagsStore>, tag: Tag) -> Result<(), String> {
    {
        let mut tags = store.tags.lock().map_err(|e| e.to_string())?;
        if let Some(existing) = tags.iter_mut().find(|t| t.id == tag.id) {
            *existing = tag;
        } else {
            tags.push(tag);
        }
    }
    store.save()
}

#[tauri::command]
pub fn delete_tag(store: State<TagsStore>, id: String) -> Result<(), String> {
    {
        let mut tags = store.tags.lock().map_err(|e| e.to_string())?;
        tags.retain(|t| t.id != id);
    }
    store.save()
}

#[tauri::command]
pub fn filter_notes_by_tag(
    store: State<NotesStore>,
    tag_id: String,
) -> Result<Vec<Note>, String> {
    let notes = store.notes.lock().map_err(|e| e.to_string())?;
    Ok(notes.iter().filter(|n| n.tags.contains(&tag_id)).cloned().collect())
}
