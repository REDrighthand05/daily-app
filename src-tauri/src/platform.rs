/// Platform detection and platform-specific values for Daily App.

#[cfg(target_os = "macos")]
pub fn is_macos() -> bool { true }
#[cfg(not(target_os = "macos"))]
pub fn is_macos() -> bool { false }

#[cfg(target_os = "windows")]
pub fn is_windows() -> bool { true }
#[cfg(not(target_os = "windows"))]
pub fn is_windows() -> bool { false }

#[cfg(target_os = "linux")]
pub fn is_linux() -> bool { true }
#[cfg(not(target_os = "linux"))]
pub fn is_linux() -> bool { false }

/// Returns the platform-appropriate default shortcut toggle keybinding.
/// Windows/Linux: Alt+Space, macOS: Super+Space
pub fn platform_default_shortcut() -> &'static str {
    if is_macos() { "Super+Space" } else { "Alt+Space" }
}