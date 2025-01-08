import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FloatLabel} from 'primeng/floatlabel';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faLocationDot, faSearch} from '@fortawesome/free-solid-svg-icons';
import {FetchService} from '../fetch.service';
import {ButtonDirective, ButtonIcon, ButtonLabel} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    AutoComplete,
    FloatLabel,
    FontAwesomeModule,
    ButtonDirective,
    Ripple,
    ButtonIcon,
    ButtonLabel,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  lista_arrivi: any[] = [];
  lista_partenza: any[] = [];
  arrivo = "";
  partenza = "";

  faLocation = faLocationDot;
  faSearch = faSearch;

  arrivi_filtrati: string[] = [];
  partenze_filtrati: string[] = [];

  constructor(private fetchService: FetchService, private router: Router) {
    this.fetchService.currentData.subscribe(data => {
      if (data) {
        this.riempoVec(this.lista_partenza, data, "partenza");
        this.riempoVec(this.lista_arrivi, data, "arrivo");
      }
    })
  }
  riempoVec(vec: string[], dati: any, chiave: string) {
    for (let dato of dati) {
      if(!vec.includes(dato[chiave])) {
        vec.push(dato[chiave]);
      }
    }
  }

  filtro(event: AutoCompleteCompleteEvent, tipo: number) {
    if (tipo === 1) {
      this.arrivi_filtrati = this.lista_arrivi.filter(aereoporto =>
        aereoporto.toLowerCase().includes(event.query.toLowerCase())
      );
    } else {
      this.partenze_filtrati = this.lista_partenza.filter(aereoporto =>
        aereoporto.toLowerCase().includes(event.query.toLowerCase())
      );
    }
  }

  redirect() {
    this.router.navigate(
      ['/ricerca'],
      {queryParams: {partenza: this.partenza, arrivo: this.arrivo}}
    )
  }
}

