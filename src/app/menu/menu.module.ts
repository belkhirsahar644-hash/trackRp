import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SiderComponent } from './sider/sider.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeaderComponent,
    SiderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  //
  exports: [
    HeaderComponent,
    SiderComponent,
    FooterComponent
  ]
})
export class MenuModule { }
