import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddconducteurComponent } from './addconducteur/addconducteur.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AddVehiculeComponent } from './add-vehicule/add-vehicule.component';

@NgModule({
  declarations: [
    AddconducteurComponent,
    AddVehiculeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AddconducteurComponent,
    AddVehiculeComponent
  ],

})
export class FormulaireModule { }
