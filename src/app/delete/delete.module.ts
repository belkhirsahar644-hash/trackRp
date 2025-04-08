import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteConducteurComponent } from './delete-conducteur/delete-conducteur.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DeleteSuperviseurComponent } from './delete-superviseur/delete-superviseur.component';
import { DeleteVehiculeComponent } from './delete-vehicule/delete-vehicule.component';


@NgModule({
  declarations: [
    DeleteConducteurComponent,
    DeleteSuperviseurComponent,
    DeleteVehiculeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DeleteConducteurComponent, DeleteSuperviseurComponent, DeleteVehiculeComponent
  ]
})
export class DeleteModule { }
