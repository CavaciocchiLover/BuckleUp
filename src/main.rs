use env_logger::Env;
use std::fs;
use actix_web::{delete, get, post, web, App, HttpResponse, HttpServer};
use mongodb::bson::{doc, Document};
use mongodb::{Client, Collection};
use actix_cors::Cors;
use actix_web::middleware::Logger;
use base64ct::{Base64, Encoding};
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};
use serde_json::Value;
#[derive(Serialize, Deserialize)]
struct Registrazione {
    nome: String,
    cognome: String,
    data: String,
    email: String,
    password: String,
}

#[derive(Serialize, Deserialize)]
struct Login {
    email: String,
    password: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize)]
struct Viaggio {
    citta: String,
    costo: f32,
    posti_liberi: u8,
    partenza: String,
    immagine: String,
    paese: Vec<String>,
    nomePacchetto: String,
    periodo: String,
    descrizione: String,
    arrivo: String,
}
#[get("/listaviaggi")]
async fn listaviaggi(client: web::Data<Client>) -> HttpResponse {
    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    match collection.find(doc!{"posti_liberi": {"$gt" : 0}}).await {
        Ok(mut cursor) => {
            let mut result: Vec<Viaggio> = Vec::new();
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

#[post("/registrazione")]
async fn registrazione(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Registrazione>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }
    let collection : Collection<Document> = client.database("BuckleUp").collection("utenti");

    match collection.find_one(doc!{"email": json.email.clone()}).await {
        Ok(cursor) => {
            if cursor == None {
                let password = Base64::encode_string(&Sha256::digest(&json.password));
                match collection.insert_one(doc!{"nome": json.nome, "cognome": json.cognome, "data_nascita": json.data, "email": json.email, "password": password, "ruolo": "utente"}).await
                {
                    Ok(_) => HttpResponse::Ok().body("Registrazione effettuata con successo"),
                    Err(e) => HttpResponse::InternalServerError().body(e.to_string())
                }
            } else {
                HttpResponse::BadRequest().body("L'utente già esiste")
            }

        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string())
    }
}

#[post("/login")]
async fn login(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Login>(&body) {
        Ok(dati) => {json = dati;},
        Err(_) => return HttpResponse::BadRequest().body("Il json non valido")
    }

    let collection : Collection<Document> = client.database("BuckleUp").collection("utenti");

    match collection.find_one(doc!{"email": json.email}).await {
        Ok(cursor) => {
            if cursor == None {
                HttpResponse::NotFound().body("Password e/o email non sono validi")
            } else {
                let password = Base64::encode_string(&Sha256::digest(&json.password));
                let password_archiviata = cursor.as_ref().unwrap().get("password").unwrap().as_str().unwrap().to_string();

                if password == password_archiviata {
                    let json: Value = serde_json::from_str(&*("{\"ruolo\": \"".to_owned() + cursor.unwrap().get_str("ruolo").unwrap() + "\"}")).unwrap();
                    HttpResponse::Ok().json(json)
                } else {
                    HttpResponse::BadRequest().body("Password e/o email non sono validi")
                }
            }
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string())
    }
}
#[post("/nuovo")]
async fn nuovo(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Viaggio>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }

    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    match collection.insert_one(json).await {
        Ok(_) => {
            HttpResponse::Ok().finish()
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string())
    }
}

#[get("/paese")]
async fn paese(lista: web::Data<Value> ,query: web::Query<Value>) -> HttpResponse {
    let nome = query.get("nome").unwrap_or(&Value::Null);
    if nome == &Value::Null {
        HttpResponse::BadRequest().body("Query non valido")
    } else {
        let codice = lista.get(nome.as_str().unwrap()).unwrap_or(&Value::Null);
        if (codice) == &Value::Null {
            HttpResponse::BadRequest().body("Il paese non esiste")
        } else {
            HttpResponse::Ok().body(codice.to_string())
        }
    }
}

#[delete("/cancella")]
async fn cancella(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Value>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }

    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    let nome = json.get("nome").unwrap_or(&Value::Null);

    if nome == &Value::Null {
        HttpResponse::BadRequest().body("Il json non è valido")
    } else {
        match collection.delete_one(doc!{"nomePacchetto": nome.as_str().unwrap()}).await {
            Ok(_) => {
                HttpResponse::Ok().finish()
            },
            Err(e) => HttpResponse::InternalServerError().body(e.to_string())
        }
    }
}

#[post("/modifica")]
async fn modifica(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Viaggio>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }

    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    match collection.replace_one(doc!{"nomePacchetto": &json.nomePacchetto}, json).await {
        Ok(_) => {
            HttpResponse::Ok().finish()
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string())
    }
}

#[post("/ricerca")]
async fn ricerca(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Value>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }

    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    let partenza = json.get("partenza").unwrap_or(&Value::Null);
    let arrivo = json.get("arrivo").unwrap_or(&Value::Null);

    if partenza == &Value::Null || arrivo == &Value::Null {
        HttpResponse::BadRequest().body("Il json non è valido")
    } else {
        match collection.find(doc!{"partenza": partenza.as_str().unwrap(), "arrivo": arrivo.as_str().unwrap()}).await {
            Ok(mut cursor) => {
                let mut result: Vec<Viaggio> = Vec::new();
                while cursor.advance().await.unwrap_or(false) {
                    match cursor.deserialize_current() {
                        Ok(document) => result.push(document),
                        Err(e) => return HttpResponse::InternalServerError().body(e.to_string()),
                    }
                }
                if result.len() == 0 {
                    HttpResponse::NotFound().finish()
                } else {
                    HttpResponse::Ok().json(result)
                }

            },
            Err(e) => HttpResponse::InternalServerError().body(e.to_string())
        }
    }
}

#[get("/pacchetto")]
async fn pacchetto(client: web::Data<Client>, query: web::Query<Value>) -> HttpResponse {
    let nome = query.get("nome").unwrap_or(&Value::Null);
    if nome == &Value::Null {
        HttpResponse::BadRequest().body("Query non valida")
    } else {
        let collection : Collection<Document> = client.database("BuckleUp").collection("viaggi");
        match collection.find_one(doc!{"nomePacchetto": nome.as_str().unwrap()}).await {
            Ok(doc) => {
                if doc == None {
                    HttpResponse::NotFound().finish()
                } else {
                    HttpResponse::Ok().json(doc)
                }
            },
            Err(e) => HttpResponse::InternalServerError().body(e.to_string())
        }
    }
}

#[post("/prenotazione")]
async fn prenotazione(client: web::Data<Client>, body: web::Bytes) -> HttpResponse {
    let json;
    match serde_json::from_slice::<Value>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }

    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    let persone = json.get("persone").unwrap_or(&Value::Null);
    let nome = json.get("nome").unwrap_or(&Value::Null);
    let email = json.get("email").unwrap_or(&Value::Null);

    if persone == &Value::Null || nome == &Value::Null || email == &Value::Null {
        HttpResponse::BadRequest().body("Il json non è valido")
    } else {
        let n_persone = persone.as_i64().unwrap() as i32;
        match collection.update_one(doc!{"nomePacchetto": nome.as_str().unwrap(),
            "posti_liberi": {"$gt": n_persone}}, doc!{
            "$push": {
                "prenotazioni": {
                    "email": email.as_str().unwrap(),
                    "nPersone": n_persone,
                }
            },
            "$inc": doc! {"posti_liberi": -n_persone}
        }).await {
            Ok(result) => {
                if result.modified_count == 1 {
                    HttpResponse::Ok().finish()
                } else {
                    HttpResponse::BadRequest().finish()
                }
            }
            Err(e) => HttpResponse::InternalServerError().body(e.to_string())
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    let mut esiste = fs::exists("./paesi.json").unwrap_or_else(|_| false);

    while !esiste {
        match fs::exists("./paesi.json") {
            Ok(ris) => esiste = ris,
            Err(_) => esiste = false
        }
        println!("Inserisci il file paesi.json e premi un tasto qualunque");
        std::io::stdin()
            .read_line(&mut String::new())
            .expect("ERRORE: impossibile leggere l'input");
    }

    let uri = "mongodb://127.0.0.1:27017/";
    let client = Client::with_uri_str(uri).await.expect("Unable to connect to MongoDB");
    let paesi: Value = serde_json::from_str(&fs::read_to_string("./paesi.json")?)?;

    env_logger::init_from_env(Env::default().default_filter_or("info"));
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST", "DELETE"])
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .app_data(web::Data::new(client.clone()))
            .app_data(web::Data::new(paesi.clone()))
            .service(listaviaggi)
            .service(registrazione)
            .service(login)
            .service(nuovo)
            .service(paese)
            .service(cancella)
            .service(ricerca)
            .service(pacchetto)
            .service(prenotazione)
    })
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}
