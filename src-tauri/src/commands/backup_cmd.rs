use std::fs;
use std::io::{Read, Write, Seek};
use tauri::State;
use crate::db::notes::NotesStore;
use crate::db::clipboard::{ClipboardStore, ClipboardEntry};
use crate::db::tags::{TagsStore, Tag};
use crate::settings::SettingsStore;

fn write_json<W: Write + Seek>(zip: &mut zip::ZipWriter<W>, name: &str, data: &str) -> Result<(), String> {
    let opts = zip::write::FileOptions::<()>::default()
        .compression_method(zip::CompressionMethod::Deflated);
    zip.start_file(name, opts).map_err(|e| e.to_string())?;
    zip.write_all(data.as_bytes()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn export_backup(notes: State<NotesStore>, clips: State<ClipboardStore>, tags: State<TagsStore>, settings: State<SettingsStore>, path: String) -> Result<(), String> {
    let file = fs::File::create(&path).map_err(|e| e.to_string())?;
    let mut zip = zip::ZipWriter::new(file);
    let n = serde_json::to_string_pretty(&*notes.notes.lock().map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    let c = serde_json::to_string_pretty(&*clips.entries.lock().map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    let t = serde_json::to_string_pretty(&*tags.tags.lock().map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    let s = serde_json::to_string_pretty(&*settings.settings.lock().map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    write_json(&mut zip, "notes.json", &n)?;
    write_json(&mut zip, "clipboard.json", &c)?;
    write_json(&mut zip, "tags.json", &t)?;
    write_json(&mut zip, "settings.json", &s)?;
    zip.finish().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn import_backup(notes: State<NotesStore>, clips: State<ClipboardStore>, tags: State<TagsStore>, path: String) -> Result<(), String> {
    let file = fs::File::open(&path).map_err(|e| e.to_string())?;
    let mut arc = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;
    for i in 0..arc.len() {
        let mut entry = arc.by_index(i).map_err(|e| e.to_string())?;
        let name = entry.name().to_string();
        let mut c = String::new();
        entry.read_to_string(&mut c).map_err(|e| e.to_string())?;
        match name.as_str() {
            "notes.json" => { let d: Vec<crate::db::notes::Note> = serde_json::from_str(&c).map_err(|e| e.to_string())?; *notes.notes.lock().map_err(|e| e.to_string())? = d; }
            "clipboard.json" => { let d: Vec<ClipboardEntry> = serde_json::from_str(&c).map_err(|e| e.to_string())?; *clips.entries.lock().map_err(|e| e.to_string())? = d; }
            "tags.json" => { let d: Vec<Tag> = serde_json::from_str(&c).map_err(|e| e.to_string())?; *tags.tags.lock().map_err(|e| e.to_string())? = d; }
            _ => {}
        }
    }
    notes.save()?; clips.save()?; tags.save()?;
    Ok(())
}

#[tauri::command]
pub fn factory_reset(notes: State<NotesStore>, clips: State<ClipboardStore>, tags: State<TagsStore>) -> Result<(), String> {
    notes.notes.lock().map_err(|e| e.to_string())?.clear();
    clips.entries.lock().map_err(|e| e.to_string())?.clear();
    tags.tags.lock().map_err(|e| e.to_string())?.clear();
    notes.save()?; clips.save()?; tags.save()?;
    Ok(())
}