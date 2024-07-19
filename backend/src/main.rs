use axum::{
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use std::fs::File as StdFile;
use std::io::Write;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/", get(root))
        .route("/file", post(create_file));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("running app rn big bro");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "SPOTEMGOTEM"
}

async fn create_file(Json(payload): Json<CreateFile>) -> StatusCode {
    if let Ok(mut file) = StdFile::create("tmp/file.no") {
        if let Err(e) = file.write_all(payload.contents.as_bytes()) {
            eprintln!("Failed to write to file: {}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    } else {
        eprintln!("Failed to create file");
        return StatusCode::INTERNAL_SERVER_ERROR;
    }

    StatusCode::CREATED
}

#[derive(Deserialize)]
struct CreateFile {
    contents: String,
}
