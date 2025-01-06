import { Component } from '@angular/core';
import {CarouselComponent} from "./carousel/carousel.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SearchBarComponent} from './search-bar/search-bar.component';

@Component({
  selector: 'app-homepage',
  imports: [
    CarouselComponent,
    NavbarComponent,
    SearchBarComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
