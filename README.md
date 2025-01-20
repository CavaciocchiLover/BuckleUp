# BuckleUp

## Dipendenze
- Cargo (solo per compilare)
- MongoDB
- MongoDB tools
## Avviare il server
Prima di poter avviare il server, bisogna importare il db in MongoDB
```shell
mongorestore --db BuckleUp ./mongo
```
Qualora volessi compilare il server, ti basterà fare:
```shell
cargo run -r
```