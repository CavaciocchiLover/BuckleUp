import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {Button} from 'primeng/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faGear, faPlaneDeparture, faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    Ripple,
    Button,
    FontAwesomeModule,
    FormsModule,
    RouterLink,
  ],
  providers: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  admin = false;

  faPlaneDeparture = faPlaneDeparture;

  constructor(private router: Router) {
  }

  ngOnInit() {

    this.items = [
      {
        label: 'Home',
        icon: 'fa-solid fa-home'
      },
      {
        label: 'Carrello',
        icon: 'fa-solid fa-cart'
      }
    ];
  }

  logout() {
    localStorage.removeItem('ruolo');
    this.router.navigate(['/home']);
  }

  protected readonly faGear = faGear;
  protected readonly faRightToBracket = faRightToBracket;
}
