import { Component } from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {DatiPacchettoComponent} from './dati-pacchetto/dati-pacchetto.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-pacchetto',
  imports: [
    NavbarComponent,
    DatiPacchettoComponent,
    FooterComponent
  ],
  templateUrl: './pacchetto.component.html',
  styleUrl: './pacchetto.component.css'
})
export class PacchettoComponent {

}
