import { Component } from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {GridComponent} from './grid/grid.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-admin-page',
  imports: [
    NavbarComponent,
    GridComponent,
    FooterComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {


}
