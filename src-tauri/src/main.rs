// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn save(name: &str, data: &str) -> String {
    match std::fs::write(name, data) {
        Ok(_) => "done".to_string(),
        Err(err) => format!("Error: {}", err),
    }
}

#[tauri::command]
fn load(name: &str) -> Option<Vec<u8>> {
    match std::fs::read(name) {
        Ok(data) => Some(data),
        Err(_) => None,
    }
}
use std::fs::File;
use std::io::copy;
use reqwest;
#[tauri::command]
fn download_file(url: String, filen: String) -> String {
    // Effectuer la requête HTTP pour télécharger le fichier
    match reqwest::blocking::get(url) {
        Ok(response) => {
            // Vérifier si la réponse est un succès
            if response.status().is_success() {
                // Ouvrir un fichier en écriture pour écrire le contenu téléchargé
                match File::create(filen) {
                    Ok(mut file) => {
                        // Copier le contenu téléchargé dans le fichier
                        match copy(&mut response.bytes().unwrap().as_ref(), &mut file) {
                            Ok(_) => return "Téléchargement terminé avec succès".to_string(),
                            Err(err) => return format!("Erreur lors de l'écriture dans le fichier : {}", err),
                        }
                    }
                    Err(err) => return format!("Erreur lors de la création du fichier : {}", err),
                }
            } else {
                return format!("Erreur: La réponse du serveur n'est pas un succès (code {}) ", response.status());
            }
        }
        Err(err) => return format!("Erreur lors de la requête HTTP : {}", err),
    }
}

fn main() {
    if let Err(err) = std::fs::create_dir_all("save") {
        eprintln!("Erreur lors de la création du dossier 'save': {}", err);
    }
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save,load,download_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
