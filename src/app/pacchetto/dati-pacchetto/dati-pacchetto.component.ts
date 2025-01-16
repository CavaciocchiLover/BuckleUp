import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-dati-pacchetto',
  imports: [
    Button,
    Card
  ],
  templateUrl: './dati-pacchetto.component.html',
  styleUrl: './dati-pacchetto.component.css'
})
export class DatiPacchettoComponent {
  constructor(private query: ActivatedRoute, private route: Router) {}

  errore = false;
  dati: any = {};
  periodo = [];
  modal_visible = false;

  ngOnInit() {
    let nome = "";

    this.query.queryParamMap.subscribe(params => {
      if (!params.has('q')) {
        this.route.navigateByUrl("/home");
      } else {
        nome = params.get('q')!;
      }
    });

    fetch("http://localhost:8080/pacchetto?nome=" + nome).then(res => {
      if (res.status === 200) {
        res.json().then(json => {
          this.dati = json;
          this.periodo = json.periodo.split('-');
        })
      } else {
        this.errore = true;
      }
    })
      .catch(() => this.errore = true);
  }

  apriModal() {
    this.modal_visible = true;
  }
}
