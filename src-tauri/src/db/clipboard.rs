use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClipboardEntry {
    pub id: String,
    pub content: String,
    pub content_type: String,
    pub content_hash: String,
    pub created_at: u64,
    #[serde(default)]
    pub starred: bool,
}

pub struct ClipboardStore {
    pub entries: Mutex<Vec<ClipboardEntry>>,
    data_path: PathBuf,

}

impl ClipboardStore {
    pub fn new() -> Self {
        let data_path = Self::data_path();
        let entries = Self::load_from_file(&data_path).unwrap_or_default();
        Self { entries: Mutex::new(entries), data_path }
    }

    fn data_path() -> PathBuf {
        let base = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
        base.join("daily").join("clipboard.json")
    }

    fn load_from_file(path: &PathBuf) -> Option<Vec<ClipboardEntry>> {
        let data = fs::read_to_string(path).ok()?;
        serde_json::from_str(&data).ok()
    }

    pub fn save(&self) -> Result<(), String> {
        let entries = self.entries.lock().map_err(|e| e.to_string())?;
        if let Some(parent) = self.data_path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let data = serde_json::to_string_pretty(&*entries).map_err(|e| e.to_string())?;
        fs::write(&self.data_path, data).map_err(|e| e.to_string())
    }
}