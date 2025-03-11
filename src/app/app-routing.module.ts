import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { LoginComponent } from './login/login.component';
import { SupPageComponent } from './sup-page/sup-page.component';
import { AddconducteurComponent } from './formulaire/addconducteur/addconducteur.component';
import { ConducteursComponent } from './dashboards/conducteurs/conducteurs.component';
import { CardsComponent } from './dashboards/cards/cards.component';
import { VehiculeComponent } from './dashboards/vehicule/vehicule.component';
import { SuperviseurComponent } from './dashboards/superviseur/superviseur.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: FirstComponent, children: [
    { path: 'home', component: CardsComponent},
         { path: 'con', component: ConducteursComponent},
         { path: 'adddriver', component: AddconducteurComponent},
         { path: 'vehicule', component: VehiculeComponent},
         {path: 'superviseur', component: SuperviseurComponent},
  ]
},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
