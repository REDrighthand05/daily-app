use std::fs;

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, &content).map_err(|e| format!("failed to write: {}", e))
}

#[tauri::command]
pub fn batch_export(base_dir: String, notes: Vec<crate::db::notes::Note>, format: String) -> Result<(), String> {
    for note in notes {
        let ext = if format == "markdown" { "md" } else { "txt" };
        let filename = format!("{}-note.{}.{}", note.created_at, note.id.chars().take(8).collect::<String>(), ext);
        let path = std::path::PathBuf::from(&base_dir).join(&filename);
        fs::write(&path, &note.content).map_err(|e| format!("failed to write {}: {}", filename, e))?;
    }
    Ok(())
}