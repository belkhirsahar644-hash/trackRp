import { Component } from '@angular/core';
import { DashboardsModule } from '../dashboards/dashboards.module';
import { FormulaireModule } from '../formulaire/formulaire.module';
import { MenuModule } from '../menu/menu.module';
@Component({
  selector: 'app-sup-page',
  standalone: false,
  templateUrl: './sup-page.component.html',
  styleUrl: './sup-page.component.scss'
})
export class SupPageComponent {
  isSiderOpen: boolean = false; // Déclarez et initialisez la propriété


   // Capturer l'état du sidebar et le transmettre au composant Cards
    handleSidebarToggle(isOpen: boolean) {
    this.isSiderOpen = isOpen;
  }

}
