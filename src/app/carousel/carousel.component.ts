import { Component, OnInit } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import {MongoClient} from 'mongodb';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [Carousel, ButtonModule, NgOptimizedImage],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  viaggi: any[] = [];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  ngOnInit()
  {
    fetch("http://localhost:8080/listaviaggi")
      .then((response) => response.json()
        .then(data => this.viaggi = data))
      .catch((error) => console.error(error));
  }
}
