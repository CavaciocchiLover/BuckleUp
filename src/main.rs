use actix_web::{get, web, App, HttpResponse, HttpServer};
use mongodb::bson::{doc, to_bson, Document, RawDocument};
use mongodb::{bson, Client, Collection};
use mongodb::error::Error;

#[get("/listaviaggi")]
async fn listaviaggi(client: web::Data<Client>) -> HttpResponse {
    let collection : Collection<bson::Document> = client.database("BuckleUp").collection("viaggi");

    match collection.find(doc!{"posti_liberi": {"$gt" : 0}}).await {
        Ok(mut cursor) => {
            let mut result: Vec<Document> = Vec::new();
            while cursor.advance().await.unwrap_or(false) {
                match cursor.deserialize_current() {
                    Ok(document) => result.push(document),
                    Err(e) => return HttpResponse::InternalServerError().body(e.to_string()),
                }
            }
            HttpResponse::Ok().json(result)
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string())
    }
}

#[actix::main]
async fn main() -> std::io::Result<()> {
    let uri = "mongodb://127.0.0.1:27017/";
    let client = Client::with_uri_str(uri).await.expect("Unable to connect to MongoDB");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(client.clone()))
            .service(listaviaggi)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}