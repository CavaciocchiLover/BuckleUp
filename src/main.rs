use actix_web::{get, web, App, HttpResponse, HttpServer};
use mongodb::bson::{doc, Document};
use mongodb::{Client, Collection};
use actix_cors::Cors;
use http::header;

#[get("/listaviaggi")]
async fn listaviaggi(client: web::Data<Client>) -> HttpResponse {
    let collection : Collection<Document> = client.database("BuckleUp").collection("viaggi");

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
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(client.clone()))
            .service(listaviaggi)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}