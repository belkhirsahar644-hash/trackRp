import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapHomeComponent } from './map-home/map-home.component';
import { InfoComponent } from './info/info.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';



@NgModule({
    declarations: [
        MapHomeComponent,
        InfoComponent
    ],
    exports: [
        MapHomeComponent, InfoComponent,
    ],
    imports: [
        CommonModule, NzButtonModule, NzModalModule, NzDrawerModule, NzFormModule, NzInputModule, NzListModule, NzTagModule
    ]
})
export class MapsModule { }
