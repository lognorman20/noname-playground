use axum::{
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use std::fs::File as StdFile;
use std::io::Write;
use std::process::Command;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(root))
        .route("/check_files", get(check_files))
        .route("/check_bin", get(check_bin))
        .route("/run", post(run))
        .route("/get_asm", post(get_asm));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("running app rn big bro");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "SPOTEMGOTEM"
}

async fn check_files() -> String {
    let output = Command::new("ls")
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        eprintln!("Failed to run `ls`");
    }

    String::from_utf8_lossy(&output.stdout).to_string()
}

async fn check_bin() -> String {
    let output = Command::new("noname")
        .arg("-V")
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        eprintln!("Failed to run `noname -V`");
    }

    String::from_utf8_lossy(&output.stdout).to_string()
}

// TODO: add option to print the asm
async fn run(Json(payload): Json<ProgramInfo>) -> (StatusCode, String) {
    // create the source code file
    println!("CREATING SOURCE CODE FILE");
    if let Ok(mut file) = StdFile::create("tmp/src/main.no") {
        if let Err(e) = file.write_all(payload.code.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to create source code file".to_string(),
            );
        }
    } else {
        eprintln!("Failed to create file");
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to create source code file".to_string(),
        );
    }

    // create the public input
    println!("CREATING PUBLIC INPUT FILE");
    if let Ok(mut file) = StdFile::create("tmp/public_input.json") {
        if let Err(e) = file.write_all(payload.public_input.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to create public input file".to_string(),
            );
        }
    } else {
        eprintln!("Failed to public input");
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to create public input file".to_string(),
        );
    }

    // create the private input
    println!("CREATING PRIVATE INPUT FILE");
    if let Ok(mut file) = StdFile::create("tmp/private_input.json") {
        if let Err(e) = file.write_all(payload.private_input.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to create private input file".to_string(),
            );
        }
    } else {
        eprintln!("Failed to private input");
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to create private input file".to_string(),
        );
    }

    // run the code
    println!("RUNNING CODE");
    let output = Command::new("noname")
        .arg("test")
        .args(&["--path", "tmp/src/main.no"])
        .args(&["--private-inputs", "tmp/private_input.json"])
        .args(&["--public-inputs", "tmp/public_input.json"])
        .args(&["--backend", &payload.backend])
        .arg("--debug")
        .output()
        .expect("Failed to execute command");

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    println!("successfully ran code, here's the response big bro");

    if output.status.success() {
        // getting the asm
        (StatusCode::OK, stdout.to_string())
    } else {
        (StatusCode::ACCEPTED, stderr.to_string())
    }
}

async fn get_asm(Json(payload): Json<ProgramInfo>) -> (StatusCode, String) {
    println!("GETTING ASM");
    let output = Command::new("noname")
        .arg("test")
        .args(&["--path", "tmp/src/main.no"])
        .args(&["--private-inputs", "tmp/private_input.json"])
        .args(&["--public-inputs", "tmp/public_input.json"])
        .args(&["--backend", &payload.backend])
        .output()
        .expect("Failed to execute command");

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);

    println!("successfully ran code, here's the response big bro");

    if output.status.success() {
        // getting the asm
        (StatusCode::OK, stdout.to_string())
    } else {
        (StatusCode::ACCEPTED, stderr.to_string())
    }
}

#[derive(Deserialize)]
struct ProgramInfo {
    code: String,
    public_input: String,
    private_input: String,
    backend: String,
}
