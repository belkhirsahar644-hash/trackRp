import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { ConducteursComponent } from './conducteurs/conducteurs.component';
import { FormulaireModule } from "../formulaire/formulaire.module";
import { VehiculeComponent } from './vehicule/vehicule.component';
import { SuperviseurComponent } from './superviseur/superviseur.component';


@NgModule({
  declarations: [
    CardsComponent,
    ConducteursComponent,
    VehiculeComponent,
    SuperviseurComponent,
  ],
  imports: [
    CommonModule,
    FormulaireModule
],
  exports: [
    CardsComponent,
    ConducteursComponent

  ]
})
export class DashboardsModule { }
