use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    pub os: String,
    pub os_version: String,
    pub app_version: String,
    pub arch: String,
}

#[tauri::command]
pub fn get_system_info() -> Result<SystemInfo, String> {
    
    
    
    Ok(SystemInfo {
        os: std::env::consts::OS.into(),
        os_version: sysinfo::System::os_version().unwrap_or_default(),
        app_version: env!("CARGO_PKG_VERSION").into(),
        arch: std::env::consts::ARCH.into(),
    })
}

#[tauri::command]
pub fn create_issue_report(info: SystemInfo, description: String) -> Result<String, String> {
    let report = format!("## Issue Report\n\n### System\n- OS: {}\n- Version: {}\n- Arch: {}\n- App: v{}\n\n### Description\n{}",
        info.os, info.os_version, info.arch, info.app_version, description);
    let path = std::env::temp_dir().join("daily-issue.md");
    std::fs::write(&path, &report).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}