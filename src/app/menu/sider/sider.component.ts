import { Component } from '@angular/core';
//dashboard
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sider',
  standalone: false,
  templateUrl: './sider.component.html',
  styleUrl: './sider.component.scss'
})
export class SiderComponent {
  isOpen = false;
  activeSubMenu: string | null = null;
  //utilisé pour émettre un événement lorsque l'état de la sidebar change (ouverte ou fermée)
  @Output() sidebarToggle = new EventEmitter<boolean>();
  constructor(private router: Router) {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.sidebarToggle.emit(this.isOpen); // Émet l'état de la sidebar
  }

}
