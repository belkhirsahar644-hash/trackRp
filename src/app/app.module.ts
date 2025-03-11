import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FirstComponent } from './first/first.component';
import { RouterModule } from '@angular/router';
import { MenuModule } from './menu/menu.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { SupPageComponent } from './sup-page/sup-page.component';
import { FormulaireModule } from "./formulaire/formulaire.module";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FirstComponent,
    SupPageComponent,



  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    MenuModule,
    DashboardsModule,
    FormulaireModule
],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
