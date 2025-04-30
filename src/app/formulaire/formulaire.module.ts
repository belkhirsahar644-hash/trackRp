import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddconducteurComponent } from './addconducteur/addconducteur.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AddVehiculeComponent } from './add-vehicule/add-vehicule.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddSuperviseurComponent } from './add-superviseur/add-superviseur.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import { AddGeofenceComponent } from './add-geofence/add-geofence.component';

@NgModule({
  declarations: [
    AddconducteurComponent,
    AddVehiculeComponent,
    AddSuperviseurComponent,
    AddNotificationComponent,
    AddGeofenceComponent,

  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NzButtonModule,
        NzModalModule,
        ReactiveFormsModule, NzFormModule, NzInputModule, NzOptionComponent, NzSelectComponent
    ],
    exports: [
        AddconducteurComponent,
        AddVehiculeComponent,
        AddSuperviseurComponent,
        AddNotificationComponent,
      AddGeofenceComponent
    ],


})
export class FormulaireModule { }
