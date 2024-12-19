import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {ButtonDirective, ButtonIcon, ButtonLabel} from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    Ripple,
    ButtonDirective,
    ButtonLabel,
    ButtonIcon,
  ],
  providers: [CookieService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  admin: string = "";

  constructor(private cookieService: CookieService) {
    //this.cookieService.set('token', 'Hello World');
    this.admin = this.cookieService.get('admin');
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'fa fa-home'
      },
      {
        label: 'Carrello',
        icon: 'pi pi-chart'
      }
    ];

    if (this.admin === 'admin') {
      
    }
  }
}
