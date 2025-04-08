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
import { DeleteModule } from '../delete/delete.module';

@NgModule({
  declarations: [
    CardsComponent,
    ConducteursComponent,
    VehiculeComponent,
    SuperviseurComponent,
  ],
  imports: [
    CommonModule,RouterModule, 
    FormulaireModule,
    NzButtonModule,
    NzModalModule,
    BrowserAnimationsModule,
    NzDividerModule, DeleteModule,NzModalModule, NzCardModule, NzGridModule,

    FormsModule, NzButtonModule, NzDropDownModule, NzIconModule, NzInputModule, NzTableModule

],
  exports: [
    CardsComponent,
    ConducteursComponent

  ]
})
export class DashboardsModule { }
