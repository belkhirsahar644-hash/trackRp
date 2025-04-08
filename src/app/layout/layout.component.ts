import {Component} from '@angular/core';


@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isSiderOpen: boolean = false; // Déclarez et initialisez la propriété


  // Capturer l'état du sidebar et le transmettre au composant Cards
  handleSidebarToggle(isOpen: boolean) {
    this.isSiderOpen = isOpen;
  }
}
