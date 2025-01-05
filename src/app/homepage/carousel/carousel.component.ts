import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import {MongoClient} from 'mongodb';
import {NgIf, NgOptimizedImage, NgStyle} from '@angular/common';
import {Tag} from 'primeng/tag';

@Component({
  selector: 'app-carousel',
  imports: [Carousel, ButtonModule, NgOptimizedImage, Tag, NgStyle, NgIf],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  viaggi: any[] = [];

  ngOnInit()
  {
    fetch("http://localhost:8080/listaviaggi")
      .then((response) => response.json()
        .then(data => this.viaggi = data))
      .catch((error) => console.error(error));
  }


}
