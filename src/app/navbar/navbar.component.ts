import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {Ripple} from 'primeng/ripple';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faGear, faPlaneDeparture, faRightFromBracket, faRightToBracket} from '@fortawesome/free-solid-svg-icons';
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
  login = false;

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

    if (ruolo !== null && localStorage.getItem('email') !== null) {
      if (ruolo === 'admin') {
        this.admin = true;
      } else {
        this.login = true;
      }
    }

    this.items = [
      {
        label: 'Home',
      },
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
      const response = await fetch("http://localhost/login", {
        method: 'POST',
        body: JSON.stringify({email: this.email, password: this.password}),
      });

      if (response.ok) {
        this.tipo_messaggio = "success";
        let json = await response.json();

        if (json["ruolo"] === "admin") {
          localStorage.setItem("ruolo", 'admin');
          this.admin = true;
        } else {
          localStorage.setItem("ruolo", "utente");
          this.login = true;
        }

        localStorage.setItem("email", this.email);
        this.messaggio_visibile = true;
        this.email = "";
        this.password = "";
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
      const resp = await fetch("http://localhost/registrazione", {
        method: 'POST',
        body: JSON.stringify({nome: this.nome, cognome: this.cognome, data: this.data_nascita,
          email: this.email, password: this.password}),
      })



      this.messaggio_visibile = true;

      if (resp.ok) {
        this.tipo_messaggio = "success";
        this.messaggio = "Ti sei registratə con successo.";
        localStorage.setItem("ruolo", 'utente');
        localStorage.setItem("email", this.email);
        this.login = true;
      } else {
        this.tipo_messaggio = "error";
        this.messaggio = await resp.text();
      }

      this.nome = "";
      this.cognome = "";
      this.data_nascita = "";
      this.email = "";
      this.password = "";
    } catch (e) {
      this.messaggio_visibile = true;
      this.messaggio = String(e);
      this.tipo_messaggio = "error";
    }
  }

  logout() {
    this.login = false;
    localStorage.removeItem("ruolo");
    localStorage.removeItem("email");
  }

  protected readonly faGear = faGear;
  protected readonly faRightToBracket = faRightToBracket;
  protected readonly faRightFromBracket = faRightFromBracket;
}
