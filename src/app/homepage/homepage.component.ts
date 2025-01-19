import { Component } from '@angular/core';
import {CarouselComponent} from "./carousel/carousel.component";
import {SearchBarComponent} from './search-bar/search-bar.component';
import {FooterComponent} from '../footer/footer.component';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-homepage',
  imports: [
    CarouselComponent,
    NavbarComponent,
    SearchBarComponent,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
