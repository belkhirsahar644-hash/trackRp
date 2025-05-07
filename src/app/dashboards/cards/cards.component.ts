import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapHomeService } from '../../services/map-home.service';
import { Device, VehiculeService } from '../../services/vehicule.service';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Superviseur, SuperviseurService } from '../../services/superviseur.service';
import { ConducteursService, Driver } from '../../services/conducteurs.service';
import {EnrichedPosition} from '../../models/models.model';

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
  modalVisible = false;
  selectedPosition: any = null;
  geofenceDrawerVisible = false;
  installedDevice: EnrichedPosition[] = [];
  selectedDevice: EnrichedPosition | null = null;
  mapEnrichedSelectedDevice!: EnrichedPosition;
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
    this.mapHomeService.fullData$.subscribe(data => {
      if (data) {
        this.installedDevice = data;
      }
    })

  }
  onMarkerClicked(position: EnrichedPosition) {
    console.log('Marqueur cliqué !', position);
    this.mapEnrichedSelectedDevice = position;
    this.selectedDevice = position;
    this.modalVisible = true;
  }


  handleOpenGeofence() {
    this.modalVisible = false;
    this.geofenceDrawerVisible = true;
  }

  handleCancel(): void {
    this.modalVisible = false;
  }

  onClickInstaller() {
    this.selectedDevice = null;
    this.reinitialiserMap = true;
  }



  onDeviceSelected(device: EnrichedPosition) {
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
    this.geofenceDrawerVisible = true;
  }

  updateMarkerLoc(event: any) {
    console.log("mrkl", event);
    this.markerLngLat = event;
  }

  updateEnrichedPos(event: EnrichedPosition[]) {
    this.installedDevice = event;
  }
}
