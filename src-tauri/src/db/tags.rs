use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub color: Option<String>,
}

pub struct TagsStore {
    pub tags: Mutex<Vec<Tag>>,
    data_path: PathBuf,
}

impl TagsStore {
    pub fn new() -> Self {
        let data_path = Self::data_path();
        let tags = Self::load_from_file(&data_path).unwrap_or_default();
        Self {
            tags: Mutex::new(tags),
            data_path,
        }
    }

    fn data_path() -> PathBuf {
        let base = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
        base.join("daily").join("tags.json")
    }

    fn load_from_file(path: &PathBuf) -> Option<Vec<Tag>> {
        let data = fs::read_to_string(path).ok()?;
        serde_json::from_str(&data).ok()
    }

    pub fn save(&self) -> Result<(), String> {
        let tags = self.tags.lock().map_err(|e| e.to_string())?;
        if let Some(parent) = self.data_path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let data = serde_json::to_string_pretty(&*tags).map_err(|e| e.to_string())?;
        fs::write(&self.data_path, data).map_err(|e| e.to_string())
    }
}
