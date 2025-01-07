import {Component, ViewChild} from '@angular/core';
import {Card} from 'primeng/card';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {Button} from 'primeng/button';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Menu} from 'primeng/menu';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {Toast} from 'primeng/toast';
import {Router} from '@angular/router';

@Component({
  selector: 'app-grid',
  imports: [
    Card,
    NgForOf,
    NgOptimizedImage,
    Button,
    ConfirmDialog,
    Menu,
    Dialog,
    InputText,
    Message,
    ReactiveFormsModule,
    DatePicker,
    FormsModule,
    Toast
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  providers: [ConfirmationService,MessageService, Router]
})
export class GridComponent {
  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private router: Router) {}
  @ViewChild('btn') btn!: Button;

  items: MenuItem[] = [
    {
      label: 'Modifica',
      icon: 'fa-solid fa-edit',
      command: () => {
        this.btn.label = 'Modifica';
        this.btn.onClick.subscribe(this.modifica());
        this.modal_visible = true;
        this.header = "Modifica pacchetto";
        this.nViaggio = 0;

        for (const viaggio of this.viaggi) {
          if (viaggio["nomePacchetto"] === this.nome) {
            const date = viaggio["periodo"].split("-");
            this.immagine = viaggio["immagine"];
            this.posto = viaggio["citta"];
            this.nome = viaggio["nomePacchetto"];
            this.nazione = viaggio["paese"][1];
            this.descrizione = viaggio["descrizione"];
            this.partenza = viaggio["partenza"];
            this.costo = viaggio["costo"];
            this.postiLiberi = viaggio["posti_liberi"];
            this.periodo = [new Date(date[0]), new Date(date[1])];
          } else {
            this.nViaggio++;
          }
        }
      }
    },
    {
      label: 'Cancella',
      icon: 'fa-solid fa-trash-can',
      command: () => {
        this.cancella(event!);
      }
    }
  ]
  viaggi: any[] = []
  modal_visible: boolean = false;
  tipo_messaggio = "";
  messaggio = "";
  messaggio_visibile = false;
  nuovoPacchetto: FormGroup | undefined;
  nome = "";
  posto = "";
  descrizione = "";
  costo = 0;
  periodo: any[] = [];
  partenza = "";
  arrivo = ""
  immagine = "";
  postiLiberi = 0;
  nazione = "";
  header = "Nuovo Pacchetto";
  nViaggio = 0;


  ngOnInit() {
    fetch("http://localhost:8080/listaviaggi")
      .then((response) => response.json()
        .then(data => this.viaggi = data))
      .catch((error) => console.error(error));

    this.nuovoPacchetto = new FormGroup({
      nome: new FormControl(''),
    })
  }

  cancella(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sei sicuræ di cancellare questo pacchetto?',
      header: 'Cancellazione pacchetto',
      icon: 'fa-regular fa-circle-question',
      rejectButtonProps: {
        label: 'Annulla',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Si',
        severity: 'danger',
        outlined: true,
      },
      accept: () => {fetch(`http://localhost:8080/cancella`, {
          method: 'DELETE',
          body: JSON.stringify({nome: this.nome})
        }).then(() => {
          this.router.navigateByUrl(this.router.url, { skipLocationChange: true });
      }).catch((error) => {
        this.messageService.add({severity: 'danger', summary: 'Errore', detail: error});

      });
      }
    })
  }

  apriModal() {
    this.tipo_messaggio = "";
    this.messaggio = "";
    this.messaggio_visibile = false;
    this.modal_visible = true;
    this.header = 'Nuovo Pacchetto';
  }

  async aggiungi() {
    if (this.nome.trim().length > 2 && this.posto.trim().length > 2
      && this.descrizione.trim().length > 2 && this.costo > 0
      && this.periodo.length == 2 && this.partenza.trim().length > 2
      && this.arrivo.trim().length > 2 && this.immagine.trim().length > 2
      && this.postiLiberi > 0 && this.nazione.trim().length > 2)
    {
      try {
        const resp = await this.chiedoSigla();
        if (resp[1] === "200") {
          await this.mandoDati('http://localhost:8080/nuovo', resp[0]);
        } else {
          this.tipo_messaggio = "danger";
          this.messaggio_visibile = true;
          this.messaggio = resp[0];
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      this.messaggio = "I dati non sono validi";
      this.messaggio_visibile = true;
      this.tipo_messaggio = "danger";
    }
  }

  async modifica() {
    if (this.viaggi[this.nViaggio]["paese"][1] !== this.nazione) {
      let resp = await this.chiedoSigla();
      if (resp[1] === "200") {
        await this.mandoDati('http://localhost:8080/modifica', resp[0]);
      } else {
        this.messaggio = resp[0];
        this.messaggio_visibile = true;
        this.tipo_messaggio = "danger";
      }
    } else {
      await this.mandoDati('http://localhost:8080/modifica');
    }
  }

  async mandoDati(url: string, sigla_paese?: string) {
    let resp;

    if (sigla_paese === null) {
      resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({citta: this.posto.trim(), costo: this.costo, posti_liberi: this.postiLiberi, partenza: this.partenza,
          immagine: this.immagine.trim(), paese: [sigla_paese, this.nazione], nomePacchetto: this.nome,
          periodo: this.periodo[0] + "-" + this.periodo[1], descrizione: this.descrizione, arrivo: this.arrivo}),
      });
    } else {
      resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({citta: this.posto.trim(), costo: this.costo, posti_liberi: this.postiLiberi, partenza: this.partenza,
          immagine: this.immagine.trim(), paese: this.viaggi[this.nViaggio]["paese"], nomePacchetto: this.nome,
          periodo: this.periodo[0] + "-" + this.periodo[1], descrizione: this.descrizione, arrivo: this.arrivo}),
      });
    }

    if (resp.ok) {
      this.tipo_messaggio = "success";
      this.messaggio_visibile = true;
      this.messaggio = "Pacchetto aggiunto con successo";
    } else {
      this.tipo_messaggio = "danger";
      this.messaggio_visibile = true;
      this.messaggio = await resp.text();
    }
  }

  async chiedoSigla() {
    this.nazione = this.nazione.trim().toLowerCase();
    this.nazione = this.nazione[0].toLowerCase() + this.nazione.substring(1, this.nazione.length);

    const richiesta_paese = await fetch('http://localhost:8080/paese?nome=' + this.nazione.trim());
    return [await richiesta_paese.text(), richiesta_paese.status.toString()];
  }
}
