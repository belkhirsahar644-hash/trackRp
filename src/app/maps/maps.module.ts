import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapHomeComponent } from './map-home/map-home.component';



@NgModule({
    declarations: [
        MapHomeComponent
    ],
    exports: [
        MapHomeComponent
    ],
    imports: [
        CommonModule
    ]
})
export class MapsModule { }
