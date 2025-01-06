import { Component } from '@angular/core';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-search-bar',
  imports: [
    IftaLabel,
    InputText,
    FormsModule,
    AutoComplete,
    FloatLabel
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  lista_arrivi: any[] = [];
  lista_partenza: any[] = [];
  arrivo = "";
  partenza = "";

  arrivi_filtrati: any[] = [];

  ngOnInit(): void {
    fetch('http://localhost:8080/arrivi')
      .then(res => res.json()
        .then(json => this.lista_arrivi = json)
      ).catch(err => console.error(err));
    fetch('http://localhost:8080/partenze')
      .then(res => res.json()
        .then(json => this.lista_partenza = json)
      ).catch(err => console.error(err));
  }

  filtro(event: AutoCompleteCompleteEvent) {
    this.arrivi_filtrati = this.lista_arrivi.filter(aereoporto =>
      aereoporto.toLowerCase().includes(event.query.toLowerCase())
    );
  }
}

