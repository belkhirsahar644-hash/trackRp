import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { Superviseur } from '../../services/superviseur.service';
import { Driver } from '../../services/conducteurs.service';
import { MapHomeService } from '../../services/map-home.service';
import { Device, VehiculeService } from '../../services/vehicule.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  isLoading = true;

  resetMapView = false;

  AppareilInstaller = 0;
  installedDeviceNames: { id: number, name: string }[] = [];
  selectedDeviceId: number | null = null;

  private positionSub: Subscription | undefined;

  constructor(
    private cardsService: CardsService,
    private mapHomeService: MapHomeService,
    private vehiculeService: VehiculeService
  ) {}


  ngOnInit() {
    console.log('CardsComponent chargé !');
    this.fetchData();

    // Lancement WebSocket
    this.mapHomeService.connectWebSocket();

    // Abonnement WebSocket
    this.positionSub = this.mapHomeService.fullData$.subscribe((positions) => {
      if (!positions || positions.length === 0) return;

      const newDeviceIds = Array.from(new Set(positions.map(p => p.deviceId)));

      // Ne pas compter les devices déjà connus
      const knownDeviceIds = this.installedDeviceNames.map(d => d.id);
      const unknownDeviceIds = newDeviceIds.filter(id => !knownDeviceIds.includes(id));

      // Mettre à jour le compteur
      const allDeviceIds = new Set([...knownDeviceIds, ...newDeviceIds]);
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

        forkJoin(deviceRequests).subscribe((devices: (Device | null)[]) => {
          const validDevices = devices.filter((d): d is Device & { id: number } => d !== null && typeof d.id === 'number');

          const newDevices = validDevices.map(d => ({
            id: d.id,
            name: d.name
          }));

// Ne pas ajouter les devices déjà présents
          const existingIds = new Set(this.installedDeviceNames.map(d => d.id));
          const uniqueNewDevices = newDevices.filter(d => !existingIds.has(d.id));

// Mise à jour finale
          this.installedDeviceNames = [...this.installedDeviceNames, ...uniqueNewDevices];
        });
      }
    });
  }
  installerClicked = false;

  onClickInstaller() {
    this.selectedDeviceId = null;
    this.resetMapView = true;  // ceci va déclencher le reset dans MapHomeComponent
  }



  onDeviceSelected(deviceId: number) {
    this.selectedDeviceId = deviceId;
  }

  fetchData() {
    this.cardsService.getVehicule()
      .pipe(catchError(error => {
        console.error('Erreur API devices:', error);
        return of([]);
      }))
      .subscribe((devices: Device[]) => {
        this.vehicleCount = devices.length;
        this.checkLoadingStatus();
      });

    this.cardsService.getSuperviseur()
      .pipe(catchError(error => {
        console.error('Erreur API users:', error);
        return of([]);
      }))
      .subscribe((superviseur: Superviseur[]) => {
        this.supervisorCount = superviseur.length;
        this.checkLoadingStatus();
      });

    this.cardsService.getDriver()
      .pipe(catchError(error => {
        console.error('Erreur API drivers:', error);
        return of([]);
      }))
      .subscribe((drivers: Driver[]) => {
        this.driverCount = drivers.length;
        this.checkLoadingStatus();
      });
  }

  checkLoadingStatus() {
    if (this.vehicleCount && this.supervisorCount && this.driverCount) {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.positionSub?.unsubscribe();
  }
}
