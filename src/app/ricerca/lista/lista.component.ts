import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataView} from 'primeng/dataview';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-lista',
  imports: [ButtonModule, CommonModule, DropdownModule, FormsModule, DataView, Tag],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css',
})
export class ListaComponent {
  constructor(private query: ActivatedRoute, private route: Router) {}

  partenza = "";
  arrivo = "";
  pacchetti: any[] = [];
  errore = false;

  ngOnInit() {
    this.query.queryParamMap.subscribe(params => {
      if (!params.has('partenza') || !params.has('arrivo')) {
        this.route.navigateByUrl("/home");
      } else {
        this.partenza = params.get('partenza')!;
        this.arrivo = params.get('arrivo')!;
      }
    });

    fetch("http://localhost/ricerca", {
      method: 'POST',
      body: JSON.stringify({partenza: this.partenza, arrivo: this.arrivo})
    }).then(res => {
      if (res.status === 200) {
        res.json().then(json => {
            this.pacchetti = json;
        })
      } else {
        this.errore = true;
      }
    })
      .catch(() => this.errore = true);
  }

  redirect(nome: string) {
    this.route.navigate(["/pacchetto"], {queryParams: {q: nome}})
  }
}
