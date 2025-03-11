import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { catchError, of } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
// Interfaces pour typer les données reçues depuis Traccar
interface Device {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  administrator: boolean;
}

interface Driver {
  id: number;
  name: string;
}

@Component({
  selector: 'app-cards',
  standalone: false,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen: boolean = false; // Propriété pour l'état de la sidebar

  vehicleCount = 0;
  supervisorCount = 0;
  driverCount = 0;
  updateInterval = 10000; // Rafraîchissement toutes les 10 secondes
  private subscription!: Subscription;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchData();
    // Actualiser les données toutes les 10 secondes
    this.subscription = interval(this.updateInterval).subscribe(() => this.fetchData());
  }

  ngOnDestroy() {
    // Éviter les fuites mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchData() {
    // Récupération du nombre de véhicules
    this.dashboardService.getDevices()
      .pipe(
        catchError(error => {
          console.error('❌ Erreur API devices:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe((devices: Device[]) => {
        console.log('✅ Véhicules récupérés:', devices);
        this.vehicleCount = devices.length;
      });

    // Récupération du nombre d'utilisateurs
    this.dashboardService.getUsers()
      .pipe(
        catchError(error => {
          console.error('❌ Erreur API users:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe((users: User[]) => {
        console.log('✅ Utilisateurs récupérés:', users);
        this.supervisorCount = users.filter(user => user.administrator).length;
      });

    // Récupération du nombre de conducteurs
    this.dashboardService.getDrivers()
      .pipe(
        catchError(error => {
          console.error('❌ Erreur API drivers:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe((drivers: Driver[]) => {
        console.log('✅ Conducteurs récupérés:', drivers);
        this.driverCount = drivers.length;
      });
  }
}
