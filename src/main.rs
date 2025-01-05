use std::fs;
use actix_web::{get, post, web, App, HttpResponse, HttpServer};
use mongodb::bson::{doc, Document};
use mongodb::{Client, Collection};
use actix_cors::Cors;
use base64ct::{Base64, Encoding};
use sha2::{Sha256, Digest};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::File;
use std::io::{self, BufRead};
use std::ops::Index;
use std::path::Path;

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
                    return HttpResponse::Ok().json(json);
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
    println!("{:#?}", body);
    let json;
    match serde_json::from_slice::<Viaggio>(&body) {
        Ok(dati) => json = dati,
        Err(_) => return HttpResponse::BadRequest().body("Il json non è valido")
    }

    let collection : Collection<Viaggio> = client.database("BuckleUp").collection("viaggi");

    match collection.insert_one(json).await {
        Ok(some) => {
            println!("{:#?}", some);
            HttpResponse::Ok().finish()
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string())
    }
}

#[get("/paese")]
async fn paese(lista: web::Data<Vec<String>>, query: web::Query<Value>) -> HttpResponse {
    let nome = query.get("nome").unwrap_or(&Value::Null);

    if nome == &Value::Null {
        HttpResponse::BadRequest().body("Query non valido")
    } else {
        let mut sx = 0;
        let mut dx = lista.len() - 1;

        while sx <= dx {
            let cn = (sx + dx) / 2;
            let riga: Vec<String> = lista[cn].split(';').collect();
            match riga[1].cmp(nome.as_str().unwrap()) {
                std::cmp::Ordering::Equal => return HttpResponse::Ok().body(riga[0]),
                std::cmp::Ordering::Less => sx = cn + 1,
                std::cmp::Ordering::Greater => {
                    if cn == 0 {
                        return HttpResponse::BadRequest().body("paese non valido")
                    }
                    dx = cn - 1;
                },
            }
        }

        //println!("{:#?}", paese);
        //let sigla = paesi.get(nome.as_str().unwrap()).unwrap_or(&Value::Null);
        /*if sigla == &Value::Null {
            HttpResponse::BadRequest().body("Il paese non esiste")
        } else {
            HttpResponse::Ok().body(paese)
        }
         */
        HttpResponse::Ok().body("")
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
    let mut paesi = Vec::<String>::new();
    if let Ok(righe) = read_lines("paesi.txt") {
        for riga in righe.flatten() {
            paesi.push(riga);
        }
    }

    println!("Il server è operativo al seguente ip: 127.0.0.1:8080");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST", "DELETE"])
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(client.clone()))
            .app_data(web::Data::new(paesi))
            .service(listaviaggi)
            .service(registrazione)
            .service(login)
            .service(nuovo)
            .service(paese)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where P: AsRef<Path>, {
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}