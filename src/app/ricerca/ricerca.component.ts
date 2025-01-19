import { Component } from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {ListaComponent} from './lista/lista.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-ricerca',
  imports: [
    NavbarComponent,
    ListaComponent,
    FooterComponent
  ],
  templateUrl: './ricerca.component.html',
  styleUrl: './ricerca.component.css'
})
export class RicercaComponent {

}
