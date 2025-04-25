

/*
//modal geofence drawer
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import { VehiculeService } from '../../services/vehicule.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  map: MapLibreMap | undefined;
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;

  // Pour gestion géofence
  addingGeofence = false;
  selectedGeofenceDevice: any = null;

  constructor(
    private mapHomeService: MapHomeService,
    private vehiculeService: VehiculeService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl({}), 'top-right');

    // Gestion clic sur la carte pour dessiner une geofence
    this.map.on('click', (e) => {
      if (this.addingGeofence) {
        const center = [e.lngLat.lng, e.lngLat.lat];
        const radius = 200; // Rayon fixe pour commencer, en mètres

        const area = `CIRCLE(${center[0]} ${center[1]}, ${radius})`;

        const newGeofence = {
          name: 'Zone ' + new Date().getTime(),
          area: area,
          description: 'Zone créée depuis la carte',
          calendarId: 0
        };

        this.http.post('/api/geofences', newGeofence).subscribe({
          next: (response: any) => {
            this.http.post('/api/permissions', {
              deviceId: this.selectedGeofenceDevice.id,
              geofenceId: response.id
            }).subscribe(() => {
              alert('Zone ajoutée avec succès !');
              this.addingGeofence = false;
              this.selectedGeofenceDevice = null;
            });
          },
          error: (err) => {
            console.error(err);
            alert("Erreur lors de la création de la zone");
            this.addingGeofence = false;
            this.selectedGeofenceDevice = null;
          }
        });
      }
    });

    this.map.on('load', () => {
      this.mapHomeService.connectWebSocket();

      this.positionsSubscription = this.mapHomeService.fullData$.subscribe(
        (positions: any[]) => {
          positions.forEach((position: any) => {
            const deviceId = position.deviceId;

            const oldMarker = this.deviceMarkers.get(deviceId);
            if (oldMarker) {
              oldMarker.remove();
            }

            const carIcon = document.createElement('img');
            carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';

            const deviceData = {
              id: deviceId,
              deviceId: deviceId,
              name: position.deviceName,
              uniqueId: position.uniqueId,
              model: position.model,
              nameDriver: position.nameDriver,
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed,
              distance: position.distance,
              battery: position.battery,
              status: position.status,
            };

            carIcon.addEventListener('click', () => {
              this.showModal(deviceData);
            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!);

            this.deviceMarkers.set(deviceId, marker);
          });
        }
      );
    });
  }

  showModal(device?: any): void {
    this.selectedDevice = device ?? null;
    this.modalVisible = true;
  }

  handleOk(): void {
    this.modalVisible = false;
  }

  handleCancel(): void {
    this.modalVisible = false;
  }

  startAddGeofence(device: any): void {
    this.modalVisible = false;
    this.addingGeofence = true;
    this.selectedGeofenceDevice = device;
    alert('Clique sur la carte pour choisir le centre de la zone géofence');
  }

  //geofence
  visible = false;




  openZoneGeofence(): void {
    this. visible = true;
    this.modalVisible = false;

    this.addingGeofence = false; // on attend le clic du bouton
    this.selectedGeofenceDevice = this.selectedDevice; // stocke le device sélectionné
    console.log("Geofencevisible après ouverture du drawer : ", this.visible);  // <-- Ajoute ça pour valider
    console.log('selectedGeofenceDevice:', this.selectedGeofenceDevice); // <-- Vérifie la valeur

    this.cdr.detectChanges();  // Forcer la détection du changement


  }


  close(): void {
    this.visible = false;
  }


  ngOnDestroy() {
    this.map?.remove();
    this.deviceMarkers.forEach(marker => marker.remove());
    this.deviceMarkers.clear();
    if (this.positionsSubscription) {
      this.positionsSubscription.unsubscribe();
    }
    this.mapHomeService.disconnectWebSocket();
  }
}
*/

/*
//version du code avec modal websocket, zone geofences
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import { VehiculeService } from '../../services/vehicule.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  map: MapLibreMap | undefined;
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;

  // Pour gestion géofence
  addingGeofence = false;
  selectedGeofenceDevice: any = null;

  constructor(
    private mapHomeService: MapHomeService,
    private vehiculeService: VehiculeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl({}), 'top-right');

    // Gestion clic sur la carte pour dessiner une geofence
    this.map.on('click', (e) => {
      if (this.addingGeofence) {
        const center = [e.lngLat.lng, e.lngLat.lat];
        const radius = 200; // Rayon fixe pour commencer, en mètres

        const area = `CIRCLE(${center[0]} ${center[1]}, ${radius})`;

        const newGeofence = {
          name: 'Zone ' + new Date().getTime(),
          area: area,
          description: 'Zone créée depuis la carte',
          calendarId: 0
        };

        this.http.post('/api/geofences', newGeofence).subscribe({
          next: (response: any) => {
            this.http.post('/api/permissions', {
              deviceId: this.selectedGeofenceDevice.id,
              geofenceId: response.id
            }).subscribe(() => {
              alert('Zone ajoutée avec succès !');
              this.addingGeofence = false;
              this.selectedGeofenceDevice = null;
            });
          },
          error: (err) => {
            console.error(err);
            alert("Erreur lors de la création de la zone");
            this.addingGeofence = false;
            this.selectedGeofenceDevice = null;
          }
        });
      }
    });

    this.map.on('load', () => {
      this.mapHomeService.connectWebSocket();

      this.positionsSubscription = this.mapHomeService.fullData$.subscribe(
        (positions: any[]) => {
          positions.forEach((position: any) => {
            const deviceId = position.deviceId;

            const oldMarker = this.deviceMarkers.get(deviceId);
            if (oldMarker) {
              oldMarker.remove();
            }

            const carIcon = document.createElement('img');
            carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';

            const deviceData = {
              id: deviceId,
              deviceId: deviceId,
              name: position.deviceName,
              uniqueId: position.uniqueId,
              model: position.model,
              nameDriver: position.nameDriver,
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed,
              distance: position.distance,
              battery: position.battery,
              status: position.status,
            };

            carIcon.addEventListener('click', () => {
              this.showModal(deviceData);
            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!);

            this.deviceMarkers.set(deviceId, marker);
          });
        }
      );
    });
  }

  showModal(device?: any): void {
    this.selectedDevice = device ?? null;
    this.modalVisible = true;
  }

  handleOk(): void {
    this.modalVisible = false;
  }

  handleCancel(): void {
    this.modalVisible = false;
  }

  startAddGeofence(device: any): void {
    this.modalVisible = false;
    this.addingGeofence = true;
    this.selectedGeofenceDevice = device;
    alert('Clique sur la carte pour choisir le centre de la zone géofence');
  }

  ngOnDestroy() {
    this.map?.remove();
    this.deviceMarkers.forEach(marker => marker.remove());
    this.deviceMarkers.clear();
    if (this.positionsSubscription) {
      this.positionsSubscription.unsubscribe();
    }
    this.mapHomeService.disconnectWebSocket();
  }
}


// components/map-home/map-home.component.ts
/*import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import { VehiculeService, Device } from '../../services/vehicule.service';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  map: MapLibreMap | undefined;
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;

  constructor(
    private mapHomeService: MapHomeService,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.on('load', () => {
      this.mapHomeService.connectWebSocket();

      this.positionsSubscription = this.mapHomeService.fullData$.subscribe(
        (positions: any[]) => {
          positions.forEach((position: any) => {
            const deviceId = position.deviceId;

            const oldMarker = this.deviceMarkers.get(deviceId);
            if (oldMarker) oldMarker.remove();

            const carIcon = document.createElement('img');
            carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';

            carIcon.addEventListener('click', () => {
              this.vehiculeService.getDevice(deviceId).subscribe((device: Device) => {
                // Handle a single device
                this.showModal({
                  deviceId: device.id,
                  name: device.name,
                  model: device.model,
                  uniqueId: device.uniqueId,
                  nameDriver: device.attributes?.nameDriver,
                  latitude: position.latitude,
                  longitude: position.longitude,
                  speed: position.speed,
                  distance: position.attributes?.totalDistance,
                  battery: position.attributes?.batteryLevel
                });
              });

            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!);

            this.deviceMarkers.set(deviceId, marker);
          });
        }
      );
    });
  }

  showModal(device?: any): void {
    this.selectedDevice = device ?? null;
    this.modalVisible = true;
  }

  handleOk(): void {
    this.modalVisible = false;
  }

  handleCancel(): void {
    this.modalVisible = false;
  }

  ngOnDestroy() {
    this.map?.remove();
    this.deviceMarkers.forEach(marker => marker.remove());
    this.deviceMarkers.clear();
    if (this.positionsSubscription) {
      this.positionsSubscription.unsubscribe();
    }
    this.mapHomeService.disconnectWebSocket();
  }
}
*/
//code modal sans geofence
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import {VehiculeService} from '../../services/vehicule.service';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  map: MapLibreMap | undefined;
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;

  constructor(private mapHomeService: MapHomeService, private vehiculeService : VehiculeService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl({}), 'top-right');
    this.map.on('load', () => {
      this.mapHomeService.connectWebSocket();

      this.positionsSubscription = this.mapHomeService.fullData$.subscribe(
        (positions: any[]) => {
          positions.forEach((position: any) => {
            const deviceId = position.deviceId;

            const oldMarker = this.deviceMarkers.get(deviceId);
            if (oldMarker) {
              oldMarker.remove();
            }

            const carIcon = document.createElement('img');
            carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';

            const deviceData = {
              deviceId: deviceId,
              name: position.deviceName,
              uniqueId: position.uniqueId,
              model: position.model,
              nameDriver: position.attributes?.nameDriver,
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed,
              distance: position.attributes?.totalDistance,
              battery: position.attributes?.batteryLevel,
              status: position.status,
            };

            carIcon.addEventListener('click', () => {
              this.showModal(deviceData);
            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!);

            this.deviceMarkers.set(deviceId, marker);
          });
        }
      );
    });
  }



  showModal(device?: any): void {
    this.selectedDevice = device ?? null;
    this.modalVisible = true;
  }

  handleOk(): void {
    this.modalVisible = false;
  }

  handleCancel(): void {
    this.modalVisible = false;
  }

  ngOnDestroy() {
    this.map?.remove();
    this.deviceMarkers.forEach(marker => marker.remove());
    this.deviceMarkers.clear();
    if (this.positionsSubscription) {
      this.positionsSubscription.unsubscribe();
    }
    this.mapHomeService.disconnectWebSocket();
  }
}
 //code du gitlab
/*
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, Marker } from 'maplibre-gl';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  //Utilise le #map du HTML pour récupérer l'élément DOM contenant la carte.
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  //Liste pour stocker tous les marqueurs créés.
  markers: Marker[] = [];


  constructor(private mapService: MapService) { }


  ngOnInit(): void { }

  ngAfterViewInit() {

    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
 // la carte est complétement chargé
    this.map.on('load', () => {

      this.mapService.getPositions().subscribe(positions => {
        positions.forEach(position => {
          // Utiliser l'icône de voiture de Flaticon (URL PNG)
          const carIcon = document.createElement('img');
          carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png'; // URL de l'icône de voiture
          carIcon.style.width = '50px';
          carIcon.style.height = '50px';

          const marker = new Marker({ element: carIcon })
            .setLngLat([position.longitude, position.latitude])
            .addTo(this.map!);

          this.markers.push(marker);
        })
      })
          });
  }


  ngOnDestroy() {
    this.map?.remove();
    this.markers.forEach(marker => marker.remove());
  }
}
 */
