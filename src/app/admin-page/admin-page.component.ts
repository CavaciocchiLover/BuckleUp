import { Component } from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {GridComponent} from './grid/grid.component';

@Component({
  selector: 'app-admin-page',
  imports: [
    NavbarComponent,
    GridComponent
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {


}
