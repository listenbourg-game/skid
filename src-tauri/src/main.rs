// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn save(name: &str,data:&str)->String  {
    let _ =std::fs::write(name.to_owned()+".json", data);
    return "done".to_string()
}
#[tauri::command]
fn load(name: &str) -> Vec<u8> {
    return std::fs::read(name.to_owned()+".json").expect("unload")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save,load])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
