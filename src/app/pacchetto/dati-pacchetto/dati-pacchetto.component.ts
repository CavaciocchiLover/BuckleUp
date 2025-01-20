import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {faLocationDot, faFlag, faPlaneDeparture, faCalendarDay, faPlaneArrival, faUser, faSackDollar} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgClass, NgIf} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Dialog} from 'primeng/dialog';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {Message} from 'primeng/message';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';


@Component({
  selector: 'app-dati-pacchetto',
  imports: [
    Button,
    Card,
    FaIconComponent,
    NgIf,
    Tag,

    Dialog,

    InputNumber,
    FormsModule,
    Message,
    ConfirmDialog,
    Accordion,
    AccordionPanel,
    AccordionContent,
    AccordionHeader,
    NgClass,
  ],
  providers: [ConfirmationService,MessageService],
  templateUrl: './dati-pacchetto.component.html',
  styleUrl: './dati-pacchetto.component.css'
})
export class DatiPacchettoComponent {
  constructor(private query: ActivatedRoute, private route: Router, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  errore = false;
  dati: any = {};
  periodo = [];
  modal_visible = false;
  nPersone = 0;
  costo = 0;
  tipo_messaggio = "";
  messaggio_visibile = false;
  messaggio = "";

  faLocationDot = faLocationDot;
  faFlag = faFlag;
  faPlane = faPlaneDeparture;
  faCalendar = faCalendarDay;
  faPlaneArrival = faPlaneArrival;
  faUser = faUser;
  faSackDollar = faSackDollar;



  ngOnInit() {
    let nome = "";

    this.query.queryParamMap.subscribe(params => {
      if (!params.has('q')) {
        this.route.navigateByUrl("/home");
      } else {
        nome = params.get('q')!;
      }
    });

    fetch("http://localhost:8080/pacchetto?nome=" + nome).then(res => {
      if (res.status === 200) {
        res.json().then(json => {
          this.dati = json;
          this.periodo = json.periodo.split('-');
        })
      } else {
        this.errore = true;
      }
    })
      .catch(() => this.errore = true);
  }

  apriModal() {
    this.modal_visible = true;
    this.tipo_messaggio = "";
    this.messaggio_visibile = false;
    this.messaggio = "";
    this.costo = 0;
    this.nPersone = 0;
  }

  chiedoConferma(event: Event) {
    if (this.nPersone > 0) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Sei sicuræ di prenotare questo questo viaggio?',
        header: 'Prenotazione',
        icon: 'fa-regular fa-circle-question',
        rejectButtonProps: {
          label: 'Annulla',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Si',
          severity: 'success',
          outlined: true,
        },
        accept: () => {
          this.prenoto()
        },
      })
    }
  }

  prenoto() {
    let email = localStorage.getItem('email');
    let ruolo  = localStorage.getItem('ruolo');
    if (email !== null && ruolo !== null) {
      if (this.nPersone > 10) {
        this.messaggio_visibile = true;
        this.messaggio = "Puoi prenotare per un massimo di 10 persone";
        this.tipo_messaggio = "error";
      } else if (this.nPersone > this.dati["posti_liberi"]) {
        this.messaggio_visibile = true;
        this.messaggio = "Non ci sono così tanti posti liberi";
        this.tipo_messaggio = "error";
      } else {
        fetch("http://localhost:8080/prenotazione", {
          method: 'POST',
          body: JSON.stringify({persone: this.nPersone, nome: this.dati["nomePacchetto"], email: email}),
        }).then((resp) => {
          if (resp.ok) {
            this.tipo_messaggio = "success";
            this.messaggio_visibile = true;
            this.messaggio = "Registrazione avvenuta con successo";
            this.dati["posti_liberi"] = this.dati["posti_liberi"] - this.nPersone;
          } else {
            this.tipo_messaggio = "error";
            this.messaggio_visibile = true;
            this.messaggio = "Si è verificato un errore";
          }
        }).catch((e) => {
          this.tipo_messaggio = "error";
          this.messaggio_visibile = true;
          this.messaggio = String(e);
        })
      }
    } else {
      this.tipo_messaggio = "error";
      this.messaggio_visibile = true;
      this.messaggio = "Rieffettua il login";
    }

  }

  calc() {
    if (this.nPersone <= 10)
      this.costo = this.dati["costo"] * this.nPersone;
  }

  protected readonly localStorage = localStorage;
}
