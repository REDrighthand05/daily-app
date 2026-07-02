use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub content: String,
    pub created_at: u64,
    pub updated_at: u64,
    #[serde(default)]
    pub pinned: bool,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub category: Option<String>,
    #[serde(default)]
    pub archived: bool,
    #[serde(default)]
    pub deleted_at: Option<u64>,
}

pub struct NotesStore {
    pub notes: Mutex<Vec<Note>>,
    data_path: PathBuf,
}

impl NotesStore {
    pub fn new() -> Self {
        let data_path = Self::data_path();
        let notes = Self::load_from_file(&data_path).unwrap_or_default();
        Self {
            notes: Mutex::new(notes),
            data_path,
        }
    }

    fn data_path() -> PathBuf {
        let base = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
        base.join("daily").join("notes.json")
    }

    fn load_from_file(path: &PathBuf) -> Option<Vec<Note>> {
        let data = fs::read_to_string(path).ok()?;
        serde_json::from_str(&data).ok()
    }

    pub fn save(&self) -> Result<(), String> {
        let notes = self.notes.lock().map_err(|e| e.to_string())?;
        if let Some(parent) = self.data_path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let data = serde_json::to_string_pretty(&*notes).map_err(|e| e.to_string())?;
        fs::write(&self.data_path, data).map_err(|e| e.to_string())
    }
}
