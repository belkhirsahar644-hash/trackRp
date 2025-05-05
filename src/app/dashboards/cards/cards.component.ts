import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapHomeService } from '../../services/map-home.service';
import { Device, VehiculeService } from '../../services/vehicule.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Superviseur, SuperviseurService } from '../../services/superviseur.service';
import { ConducteursService, Driver } from '../../services/conducteurs.service';

@Component({
  selector: 'app-cards',
  standalone: false,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {
  deviceCount = 0;
  supervisorCount = 0;
  driverCount = 0;
  AppareilInstaller = 0;
  reinitialiserMap = false;


  installedDevice: { id: number, name: string }[] = [];
  selectedDevice: any | null = null;

  private positionSub: Subscription | undefined;
  markerLngLat: any;
  constructor(
    private mapHomeService: MapHomeService,
    private vehiculeService: VehiculeService,
    private superviseurService:SuperviseurService,
    private conducteursService:ConducteursService
  ) {}


  ngOnInit() {
    console.log('CardsComponent chargé !');
    this.fetchData();

    // Lancement WebSocket
    this.mapHomeService.connectWebSocket();

    // Abonnement WebSocket
    this.positionSub = this.mapHomeService.fullData$.subscribe((positions) => {
      //Si la donnée est vide ou absente, on quitte sans rien faire
      if (!positions || positions.length === 0) return;

      //Set pour retirer les doublons
      const PositionDeviceIds = Array.from(new Set(positions.map(position => position.deviceId)));

      // Ne pas compter les devices déjà connus
      const knownDeviceIds = this.installedDevice.map(device => device.id); //pour chaque device on prend son id
      const unknownDeviceIds = PositionDeviceIds.filter(id => !knownDeviceIds.includes(id));

      // Mettre à jour le compteur
      const allDeviceIds = new Set([...knownDeviceIds, ...PositionDeviceIds]); //fusionner les 2 tableaux
      this.AppareilInstaller = allDeviceIds.size;

      if (unknownDeviceIds.length > 0) {
        const deviceRequests = unknownDeviceIds.map(id =>
          this.vehiculeService.getDeviceById(id).pipe(
            catchError(error => {
              console.error(`Erreur lors de la récupération du device ${id}`, error);
              return of(null);
            })
          )
        );

        //forkJoin: attendre que toutes les requêtes soient terminées
        forkJoin(deviceRequests).subscribe((devices: (Device | null)[]) => {
          const validDevices = devices.filter((d): d is Device & { id: number } => d !== null && typeof d.id === 'number');

          const newDevices = validDevices.map(d => ({
            id: d.id,
            name: d.name
          }));

// Ne pas ajouter les devices déjà présents
          const existingIds = new Set(this.installedDevice.map(d => d.id));
          const uniqueNewDevices = newDevices.filter(d => !existingIds.has(d.id));

// ajoute les nouveaux appareils à la liste existante
          this.installedDevice = [...this.installedDevice, ...uniqueNewDevices];
        });
      }
    });
  }

  onClickInstaller() {
    this.selectedDevice = null;
    this.reinitialiserMap = true;  // ceci va réinitialiserMap
  }



  onDeviceSelected(device: any) {
    this.selectedDevice = device;
  }

  fetchData() {
    this.vehiculeService.getDevices()
      .pipe(catchError(error => {
        console.error('Erreur API devices:', error);
        return of([]);
      }))
      .subscribe((devices: Device[]) => {
        this.deviceCount = devices.length;
      });

    this.superviseurService.getSuperviseur()
      .pipe(catchError(error => {
        console.error('Erreur API users:', error);
        return of([]);
      }))
      .subscribe((superviseur: Superviseur[]) => {
        this.supervisorCount = superviseur.length;

      });

    this.conducteursService.getDriver()
      .pipe(catchError(error => {
        console.error('Erreur API drivers:', error);
        return of([]);
      }))
      .subscribe((drivers: Driver[]) => {
        this.driverCount = drivers.length;
      });
  }

  ngOnDestroy() {
    this.positionSub?.unsubscribe();
  }

  markZone() {

  }

  confirmZone() {

  }

  updateMarkerLoc(event: any) {
    this.markerLngLat = event;
  }
}
