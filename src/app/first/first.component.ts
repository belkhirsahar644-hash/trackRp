import { Component } from '@angular/core';
import { MenuModule } from '../menu/menu.module';
import { DashboardsModule } from '../dashboards/dashboards.module';

@Component({
  selector: 'app-first',
  standalone: false,
  templateUrl: './first.component.html',
  styleUrl: './first.component.scss'
})
export class FirstComponent  {
  isSiderOpen: boolean = false; // Déclarez et initialisez la propriété


   // Capturer l'état du sidebar et le transmettre au composant Cards
    handleSidebarToggle(isOpen: boolean) {
    this.isSiderOpen = isOpen;
  }
}
