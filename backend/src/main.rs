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

    let app = Router::new().route("/", get(root)).route("/run", post(run));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("running app rn big bro");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "SPOTEMGOTEM"
}

async fn run(Json(payload): Json<File>) -> StatusCode {
    // create the source code file
    if let Ok(mut file) = StdFile::create("tmp/src/main.no") {
        if let Err(e) = file.write_all(payload.code.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    } else {
        eprintln!("Failed to create file");
        return StatusCode::INTERNAL_SERVER_ERROR;
    }

    // create the public input
    if let Ok(mut file) = StdFile::create("tmp/public_input.json") {
        if let Err(e) = file.write_all(payload.public_input.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    } else {
        eprintln!("Failed to public input");
        return StatusCode::INTERNAL_SERVER_ERROR;
    }

    // create the private input
    if let Ok(mut file) = StdFile::create("tmp/private_input.json") {
        if let Err(e) = file.write_all(payload.private_input.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    } else {
        eprintln!("Failed to private input");
        return StatusCode::INTERNAL_SERVER_ERROR;
    }

    // run the code
    let output = Command::new("noname")
        .arg("test")
        .args(&["--path", "tmp/src/main.no"])
        .args(&["--private-inputs", "tmp/private_input.json"])
        .args(&["--public-inputs", "tmp/public_input.json"])
        .arg("--debug")
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        eprintln!("Command executed with failing error code");
        return StatusCode::INTERNAL_SERVER_ERROR;
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    println!("{}", stdout);

    StatusCode::OK
}

#[derive(Deserialize)]
struct File {
    code: String,
    public_input: String,
    private_input: String,
}
