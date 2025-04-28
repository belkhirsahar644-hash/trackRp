import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AddconducteurComponent } from './formulaire/addconducteur/addconducteur.component';
import { ConducteursComponent } from './dashboards/conducteurs/conducteurs.component';
import { CardsComponent } from './dashboards/cards/cards.component';
import { VehiculeComponent } from './dashboards/vehicule/vehicule.component';
import { SuperviseurComponent } from './dashboards/superviseur/superviseur.component';
import { MapComponent } from './map/map.component';
import {LayoutComponent} from './layout/layout.component';
import {InfoComponent} from './maps/info/info.component';
import {NotificationComponent} from './dashboards/notification/notification.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutComponent, children: [
    { path: 'home', component: CardsComponent},
         { path: 'conducteur', component: ConducteursComponent},
         { path: 'adddriver', component: AddconducteurComponent},
         { path: 'vehicule', component: VehiculeComponent},
         { path: 'superviseur', component: SuperviseurComponent},
         { path: 'map/:deviceId', component: MapComponent},
         { path: 'notif', component: NotificationComponent},
         { path: 'info', component: InfoComponent},

           ]
},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
