import { Routes } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {AdminPageComponent} from './admin-page/admin-page.component';
import {guardiaGuard} from './admin-page/guardia.guard';
import {PacchettoComponent} from './pacchetto/pacchetto.component';
import {RicercaComponent} from './ricerca/ricerca.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'admin', component: AdminPageComponent, canActivate: [guardiaGuard]},
  {path: 'pacchetto', component: PacchettoComponent},
  {path: 'ricerca', component: RicercaComponent},
];
