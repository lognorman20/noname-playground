use axum::{
    http::{Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use std::fs::File as StdFile;
use std::io::Write;
use std::process::Command;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    let app = Router::new()
        .route("/", get(root))
        .layer(cors.clone())
        .route("/check_files", get(check_files))
        .layer(cors.clone())
        .route("/check_bin", get(check_bin))
        .layer(cors.clone())
        .route("/run", post(run))
        .layer(cors.clone())
        .route("/get_asm", post(get_asm))
        .layer(cors.clone());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("running app rn big bro");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> (StatusCode, Json<serde_json::Value>) {
    let response = serde_json::json!({
        "response": "SPOTEMGOTEM"
    });
    (StatusCode::OK, Json(response))
}

async fn check_files() -> (StatusCode, Json<serde_json::Value>) {
    let output = Command::new("ls")
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        let response = serde_json::json!({
            "status": "success",
            "response": String::from_utf8_lossy(&output.stdout).to_string()
        });
        (StatusCode::OK, Json(response))
    } else {
        eprintln!("Failed to run `ls`");
        let response = serde_json::json!({
            "status": "error",
            "response": String::from_utf8_lossy(&output.stderr).to_string()
        });
        (StatusCode::INTERNAL_SERVER_ERROR, Json(response))
    }
}

async fn check_bin() -> (StatusCode, Json<serde_json::Value>) {
    let output = Command::new("./noname")
        .arg("-V")
        .output()
        .expect("Failed to execute command");

    if output.status.success() {
        let response = serde_json::json!({
            "status": "success",
            "response": String::from_utf8_lossy(&output.stdout).to_string()
        });
        (StatusCode::OK, Json(response))
    } else {
        eprintln!("Failed to run `noname -V`");
        let response = serde_json::json!({
            "status": "error",
            "response": String::from_utf8_lossy(&output.stderr).to_string()
        });
        (StatusCode::INTERNAL_SERVER_ERROR, Json(response))
    }
}

// TODO: add option to print the asm
async fn run(Json(payload): Json<ProgramInfo>) -> (StatusCode, Json<serde_json::Value>) {
    // create the source code file
    println!("CREATING SOURCE CODE FILE");
    if let Ok(mut file) = StdFile::create("tmp/src/main.no") {
        if let Err(e) = file.write_all(payload.code.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            let response = serde_json::json!({
                "status": "error",
                "response": "Failed to create source code file"
            });
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
        }
    } else {
        eprintln!("Failed to create file");
        let response = serde_json::json!({
            "status": "error",
            "response": "Failed to create source code file"
        });
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
    }

    // create the public input
    println!("CREATING PUBLIC INPUT FILE");
    if let Ok(mut file) = StdFile::create("tmp/public_input.json") {
        if let Err(e) = file.write_all(payload.public_input.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            let response = serde_json::json!({
                "status": "error",
                "response": "Failed to create public input file"
            });
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
        }
    } else {
        eprintln!("Failed to public input");
        let response = serde_json::json!({
            "status": "error",
            "response": "Failed to create public input file"
        });
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
    }

    // create the private input
    println!("CREATING PRIVATE INPUT FILE");
    if let Ok(mut file) = StdFile::create("tmp/private_input.json") {
        if let Err(e) = file.write_all(payload.private_input.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            let response = serde_json::json!({
                "status": "error",
                "response": "Failed to create private input file"
            });
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
        }
    } else {
        eprintln!("Failed to private input");
        let response = serde_json::json!({
            "status": "error",
            "response": "Failed to create private input file"
        });
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(response));
    }

    // run the code
    println!("RUNNING CODE");
    let output = Command::new("./noname")
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
        let response = serde_json::json!({
            "status": "success",
            "response": stdout.to_string()
        });
        (StatusCode::OK, Json(response))
    } else {
        let response = serde_json::json!({
            "status": "error",
            "response": stderr.to_string()
        });
        (StatusCode::ACCEPTED, Json(response))
    }
}

async fn get_asm(Json(payload): Json<ProgramInfo>) -> (StatusCode, Json<serde_json::Value>) {
    println!("GETTING ASM");
    let output = Command::new("./noname")
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
        let response = serde_json::json!({
            "status": "success",
            "response": stdout.to_string()
        });
        (StatusCode::OK, Json(response))
    } else {
        let response = serde_json::json!({
            "status": "error",
            "response": stderr.to_string()
        });
        (StatusCode::ACCEPTED, Json(response))
    }
}

#[derive(Deserialize)]
struct ProgramInfo {
    code: String,
    public_input: String,
    private_input: String,
    backend: String,
}
