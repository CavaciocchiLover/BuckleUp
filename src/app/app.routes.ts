import { Routes } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {AdminPageComponent} from './admin-page/admin-page.component';
import {guardiaGuard} from './admin-page/guardia.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'admin', component: AdminPageComponent, canActivate: [guardiaGuard]
}];
