import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { ConducteursComponent } from './conducteurs/conducteurs.component';
import { FormulaireModule } from "../formulaire/formulaire.module";
import { VehiculeComponent } from './vehicule/vehicule.component';
import { SuperviseurComponent } from './superviseur/superviseur.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { RouterModule } from '@angular/router';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {MapsModule} from '../maps/maps.module';
import { NotificationComponent } from './notification/notification.component';
import { HistoriqueNotificationComponent } from './historique-notification/historique-notification.component';

@NgModule({
  declarations: [
    CardsComponent,
    ConducteursComponent,
    VehiculeComponent,
    SuperviseurComponent,
    NotificationComponent,
    HistoriqueNotificationComponent,
  ],
  imports: [
    CommonModule,RouterModule,
    NzPopconfirmModule,
    FormulaireModule,
    NzButtonModule,
    NzModalModule,
    BrowserAnimationsModule,
    NzDividerModule,NzModalModule, NzCardModule, NzGridModule,
    FormsModule, MapsModule,NzButtonModule, NzDropDownModule, NzIconModule, NzInputModule, NzTableModule

],
  exports: [
    CardsComponent,
    ConducteursComponent

  ]
})
export class DashboardsModule { }
