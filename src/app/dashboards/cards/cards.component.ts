import { Component } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { Superviseur } from '../../services/superviseur.service';
import { Device } from '../../services/vehicule.service';
import { Driver } from '../../services/conducteurs.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-cards',
  standalone: false,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent  {
  vehicleCount = 0;
  supervisorCount = 0;
  driverCount = 0;
  isLoading = true;  // Variable pour l'état de chargement

  constructor(private cardsService:CardsService ) {}
  ngOnInit() {
    console.log(" CardsComponent chargé !");
    this.fetchData();
  }

  fetchData() {
    // Récupération du nombre de véhicules
    this.cardsService.getVehicule()
      .pipe(
        catchError(error => {
          console.error(' Erreur API devices:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe((devices: Device[]) => {
        console.log(' Véhicules récupérés:', devices);
        this.vehicleCount = devices.length;
        this.checkLoadingStatus();  // Vérifie si toutes les données sont chargées

      });

    // Récupération du nombre d'utilisateurs
    this.cardsService.getSuperviseur()
      .pipe(
        catchError(error => {
          console.error(' Erreur API users:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe((superviseur: Superviseur[]) => {
        console.log(' Utilisateurs récupérés:', superviseur);
        this.supervisorCount = superviseur.length;
        this.checkLoadingStatus();  // Vérifie si toutes les données sont chargées

        //this.supervisorCount = superviseur.filter(user => user.administrator).length;
      });

    // Récupération du nombre de conducteurs
    this.cardsService.getDriver()
      .pipe(
        catchError(error => {
          console.error(' Erreur API drivers:', error);
          return of([]); // Retourne un tableau vide en cas d'erreur
        })
      )
      .subscribe((drivers: Driver[]) => {
        console.log(' Conducteurs récupérés:', drivers);
        this.driverCount = drivers.length;
        this.checkLoadingStatus();  // Vérifie si toutes les données sont chargées

      });

  }
  checkLoadingStatus() {
    if (this.vehicleCount && this.supervisorCount && this.driverCount) {
      this.isLoading = false; // Désactive l'indicateur de chargement
    }
  }
}
