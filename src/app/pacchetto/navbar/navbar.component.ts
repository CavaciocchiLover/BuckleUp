import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faGear, faPlaneDeparture, faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from '@angular/forms';
import {Message} from 'primeng/message';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    Menubar,
    Ripple,
    NgIf,
    Button,
    Dialog,
    InputText,
    FontAwesomeModule,
    FormsModule,
    Message,
    RouterLink
  ],
  providers: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  admin = false;
  visible = false;

  model_login = true;
  email = "";
  password = "";
  nome = "";
  cognome = "";
  data_nascita = "";

  messaggio_visibile = false;
  tipo_messaggio = "";
  messaggio = "";

  faPlaneDeparture = faPlaneDeparture;

  constructor(private router: Router) {}

  ngOnInit() {

    const ruolo = localStorage.getItem("ruolo");
    console.log(ruolo);

    if (ruolo !== null && ruolo === 'admin') {
      this.admin = true;
    }

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
    this.messaggio_visibile = false;
    this.messaggio = "";
    this.tipo_messaggio = "";

    this.visible = true;
  }

  async loginFun() {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: 'POST',
        body: JSON.stringify({email: this.email, password: this.password}),
      });

      this.messaggio_visibile = true;

      if (response.ok) {
        this.tipo_messaggio = "success";
        let json = await response.json();

        if (json["ruolo"] === "admin") {
          localStorage.setItem("ruolo", 'admin');
          this.admin = true;
        }

        this.messaggio = "Ti sei loggatə con successo."

      } else {
        this.tipo_messaggio = "error";
        this.messaggio = await response.text()
      }

    } catch (e) {
      this.messaggio_visibile = true;
      this.messaggio = String(e);
      this.tipo_messaggio = "error";
    }
  }

  async registrazione()
  {
    try {
      const resp = await fetch("http://localhost:8080/registrazione", {
        method: 'POST',
        body: JSON.stringify({nome: this.nome, cognome: this.cognome, data: this.data_nascita,
          email: this.email, password: this.password}),
      })

      this.messaggio_visibile = true;
      this.messaggio = String(resp.body);

      if (resp.ok) {
        this.tipo_messaggio = "success";
      } else {
        this.tipo_messaggio = "error";
      }
    } catch (e) {
      this.messaggio_visibile = true;
      this.messaggio = String(e);
      this.tipo_messaggio = "error";
    }
  }

  protected readonly faGear = faGear;
  protected readonly faRightToBracket = faRightToBracket;
}
