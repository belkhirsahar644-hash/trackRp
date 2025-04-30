import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { Superviseur } from '../../services/superviseur.service';
import { Driver } from '../../services/conducteurs.service';
import { MapHomeService } from '../../services/map-home.service';
import {Device, VehiculeService} from '../../services/vehicule.service';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cards',
  standalone: false,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  vehicleCount = 0;
  supervisorCount = 0;
  driverCount = 0;
  isLoading = true;  // Variable pour l'état de chargement

  installedDeviceNames: string[] = [];

  AppareilInstaller = 0;
  constructor(private cardsService:CardsService,
              private mapHomeService: MapHomeService,
              private vehiculeService: VehiculeService) {}
  ngOnInit() {
    console.log(" CardsComponent chargé !");
    this.fetchData();

    /*this.mapHomeService.fullData$.subscribe((positions) => {
      if (positions ) {
                this.AppareilInstaller = positions.length;
      }
    });
    this.mapHomeService.connectWebSocket(); // Lance la connexion WebSocket
*/
    this.mapHomeService.fullData$.pipe(
      switchMap((positions) => {
        if (!positions || positions.length === 0) {
          this.AppareilInstaller = 0;
          return of([]);
        }

        this.AppareilInstaller = positions.length;

        const uniqueDeviceIds = Array.from(new Set(positions.map(p => p.deviceId)));

        // Appels parallèles pour récupérer les noms
        const deviceRequests = uniqueDeviceIds.map(id =>
          this.vehiculeService.getDeviceById(id).pipe(
            catchError(error => {
              console.error(`Erreur lors de la récupération du device ${id}`, error);
              return of(null); // Pour ne pas bloquer forkJoin
            })
          )
        );

        return forkJoin(deviceRequests);
      }),
      map(devices => devices.filter(device => device !== null))
    ).subscribe((devices: Device[]) => {
      this.installedDeviceNames = devices.map(d => d.name);
    });

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
