import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {Button, ButtonDirective, ButtonIcon, ButtonLabel} from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';
import {NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    Ripple,
    ButtonDirective,
    ButtonLabel,
    ButtonIcon,
    NgIf,
    Button,
    Dialog,
    InputText,
  ],
  providers: [CookieService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  admin: boolean;
  visible = false;

  constructor(private cookieService: CookieService) {
    //this.cookieService.set('token', 'Hello World');
    this.admin = this.cookieService.get('admin') as unknown as boolean;
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

  showDialog() {
    this.visible = true;
  }
}
