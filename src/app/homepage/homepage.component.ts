import { Component } from '@angular/core';
import {CarouselComponent} from "./carousel/carousel.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {SearchBarComponent} from './search-bar/search-bar.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-homepage',
  imports: [
    CarouselComponent,
    NavbarComponent,
    SearchBarComponent,
    FooterComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
