/*import {
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
*/

/*
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
              deviceId: this.selectedGeofenceDevice.deviceId,
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
*/
/*
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements  AfterViewInit, OnDestroy {
  //variable principale
  map: MapLibreMap | undefined; //pour stocker l'objet carte
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;
  // Pour gestion géofence
  addingGeofence = false;
  selectedGeofenceDevice: any = null;



  constructor(private mapHomeService: MapHomeService, private http: HttpClient) {}


  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    //navigation control
    this.map.addControl(new NavigationControl({}), 'top-right');

    this.map.on('click', (e) => {
      if (this.addingGeofence) {
        const center = [e.lngLat.lng, e.lngLat.lat];
        const radius = 200; // par défaut 200m pour le cercle

        let area = '';

        if (this.newGeofenceType === 'circle') {
          area = `CIRCLE(${center[0]} ${center[1]}, ${radius})`;
        }
        // Tu peux plus tard ajouter d'autres formes ici

        const newGeofence = {
          name: this.newGeofenceName,
          area: area,
          description: 'Zone créée depuis la carte',
          calendarId: 0
        };

        this.http.post('/api/geofences', newGeofence).subscribe({
          next: (response: any) => {
            this.http.post('/api/permissions', {
              deviceId: this.selectedGeofenceDevice.deviceId,
              geofenceId: response.id
            }).subscribe(() => {
              alert('Zone ajoutée avec succès !');
              this.addingGeofence = false;
              this.selectedGeofenceDevice = null;
              this.newGeofenceName = '';
              this.newGeofenceType = 'circle';
              this.loadGeofences(this.selectedDevice.deviceId); // Recharge les zones
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
          positions.forEach((position: any) => { // Pour chaque position reçue, on fait un traitement
            const deviceId = position.deviceId;

            // verif si existe un marquer pour ce device
            const oldMarker = this.deviceMarkers.get(deviceId);

            if (oldMarker) {
              oldMarker.remove();
            }

            const carIcon = document.createElement('img');

            if (position.status === 'offline') {
              carIcon.src = 'https://cdn-icons-png.flaticon.com/512/4042/4042715.png';
            } else {
              carIcon.src = 'https://cdn-icons-png.flaticon.com/512/2813/2813010.png';
            }

            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';

            const deviceData = {
              deviceId: deviceId,
              name: position.deviceName,
              uniqueId: position.uniqueId,
              model: position.model,
              nameDriver: position.nameDriver,
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed,
              distance: position.attributes?.totalDistance,
              battery: position.attributes?.batteryLevel,
              status: position.status,
            };

            //icon est cliquable pour ouvrir le modal
            carIcon.addEventListener('click', () => {
              this.showModal(deviceData);
            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!); // ajoute à la carte

            //On sauvegarde ce nouveau marqueur dans la map deviceMarkers
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

  handleCancel(): void {
    this.modalVisible = false;
  }

  visibleGeofence = false;



  showGeofence(): void {

    this.modalVisible = false;
    this.visibleGeofence = true;
    if (this.selectedDevice) {
      this.loadGeofences(this.selectedDevice.deviceId); // Appeler la méthode propre
    }
  }
  geofences: any[] = [];

  loadGeofences(deviceId: number): void {
    this.mapHomeService.getGeofencesByDeviceId(deviceId).subscribe(
      (data) => {
        this.geofences = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des geofences', error);
      }
    );
  }


 /*startAddGeofence(device: any): void {
    this.modalVisible = false;
    this.addingGeofence = true;
    this.selectedGeofenceDevice = device;
    alert('Clique sur la carte pour choisir le centre de la zone géofence');
  }*/
/*
  newGeofenceName: string = '';
  newGeofenceType: string = 'circle'; // valeur par défaut

  prepareAddGeofence(): void {
    this.addingGeofence = true;
    this.selectedGeofenceDevice = this.selectedDevice; // Récupère le device actuel
    this.newGeofenceName = ''; // Reset le formulaire
    this.newGeofenceType = 'circle';
  }

  confirmAddGeofence(): void {
    if (!this.newGeofenceName || !this.newGeofenceType) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    alert('Maintenant, clique sur la carte pour choisir le centre de la zone.');

    // Ici, on reste en mode "addingGeofence", mais on sait maintenant le nom et le type à utiliser
  }


  close(): void {
    this.visibleGeofence = false;
  }


  showAddZoneOptions = false;

  toggleAddZoneOptions() {
    this.showAddZoneOptions = !this.showAddZoneOptions;
  }

  createZone(type: string) {
    console.log('Créer une zone de type :', type);
    // Ici tu peux ouvrir un autre formulaire, ou afficher des champs supplémentaires
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
//code final

import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy, inject
} from '@angular/core';
import * as turf from '@turf/turf';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
type Type = 'Zone identifié' | 'Zone autorisé';


@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.scss'
})
export class MapHomeComponent implements  AfterViewInit, OnDestroy {
  //variable principale
  map: MapLibreMap | undefined; //pour stocker l'objet carte
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;
  // Pour gestion géofence
  addingGeofence = false;
  selectedGeofenceDevice: any = null;

  tempCircleId: string | null = null; // <=== Pour stocker l'id du cercle temporaire


  constructor(
    private mapHomeService: MapHomeService,
    private http: HttpClient,
    ) {}


  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
  });

    //navigation control
    this.map.addControl(new NavigationControl({}), 'top-right');

    // Gestion clic sur la carte pour dessiner une geofence
    this.map.on('click', (e) => {
      if (this.addingGeofence) {
        const center = [e.lngLat.lng, e.lngLat.lat];
        const radiusInMeters  = 800; // Rayon fixe pour commencer, en mètres

        // Supprimer le cercle précédent s'il existe
        if (this.tempCircleId && this.map!.getSource(this.tempCircleId)) {
          this.map!.removeLayer(this.tempCircleId);
          this.map!.removeSource(this.tempCircleId);
        }

        const circleId = `circle-${Date.now()}`;
        this.tempCircleId = circleId;

        // Utiliser Turf pour créer un vrai cercle
        const circle = turf.circle(center, radiusInMeters, {
          steps: 64,    // plus tu augmentes steps, plus le cercle est lisse
          units: 'meters'
        });

        // Ajouter la source du cercle
        this.map!.addSource(circleId, {
          type: 'geojson',
          data: circle
        });

        // Ajouter la couche cercle
        this.map!.addLayer({
          id: circleId,
          type: 'fill',
          source: circleId,
          paint: {
            'fill-color': '#3b9ddd',
            'fill-opacity': 0.4
          }
        });

        const area = `CIRCLE(${center[0]} ${center[1]}, ${radiusInMeters})`;

        const newGeofence = {
          name: this.validateForm.value.nom,
          area: area,
          description: 'Zone créée depuis la carte',
          calendarId: 0
        };

        this.http.post('/api/geofences', newGeofence).subscribe({
          next: (response: any) => {
            this.http.post('/api/permissions', {
              deviceId: this.selectedGeofenceDevice.deviceId,
              geofenceId: response.id
            }).subscribe(() => {
              alert('Zone ajoutée avec succès !');
              // Supprimer le cercle temporaire après ajout
              if (this.tempCircleId && this.map!.getSource(this.tempCircleId)) {
                this.map!.removeLayer(this.tempCircleId);
                this.map!.removeSource(this.tempCircleId);
                this.tempCircleId = null;
              }
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
          positions.forEach((position: any) => { // Pour chaque position reçue, on fait un traitement
            const deviceId = position.deviceId;

            // verif si existe un marquer pour ce device
            const oldMarker = this.deviceMarkers.get(deviceId);

            if (oldMarker) {
              oldMarker.remove();
            }

            const carIcon = document.createElement('img');

            if (position.status === 'offline') {
              carIcon.src = 'https://cdn-icons-png.flaticon.com/512/4042/4042715.png';
            } else {
              carIcon.src = 'https://cdn-icons-png.flaticon.com/512/2813/2813010.png';
            }

            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';

            const deviceData = {
              deviceId: deviceId,
              name: position.deviceName,
              uniqueId: position.uniqueId,
              model: position.model,
              nameDriver: position.nameDriver,
              latitude: position.latitude,
              longitude: position.longitude,
              speed: position.speed,
              distance: position.attributes?.totalDistance,
              battery: position.attributes?.batteryLevel,
              status: position.status,
            };

            //icon est cliquable pour ouvrir le modal
            carIcon.addEventListener('click', () => {
              this.showModal(deviceData);
            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!); // ajoute à la carte

            //On sauvegarde ce nouveau marqueur dans la map deviceMarkers
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

  handleCancel(): void {
    this.modalVisible = false;
  }

  visibleGeofence = false;



  showGeofence(): void {

    this.modalVisible = false;
    this.visibleGeofence = true;
    if (this.selectedDevice) {
      this.loadGeofences(this.selectedDevice.deviceId); // Appeler la méthode propre
    }
  }
  geofences: any[] = [];

  loadGeofences(deviceId: number): void {
    this.mapHomeService.getGeofencesByDeviceId(deviceId).subscribe(
      (data) => {
        this.geofences = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des geofences', error);
      }
    );
  }


  startAddGeofence(device: any): void {
    this.modalVisible = false;
    this.addingGeofence = true;
    this.selectedGeofenceDevice = device;
    alert('Clique sur la carte pour choisir le centre de la zone géofence');
  }

  close(): void {
    this.visibleGeofence = false;
  }


  FormVisible= false;
  ShowForm(){
    this.FormVisible= !this.FormVisible;
  }
  private fb = inject(FormBuilder);

  validateForm = this.fb.group({
    nom: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<Type | null>(null, Validators.required)
  });
  AjoutertForm(): void {
    if (this.validateForm.valid && this.selectedDevice) {
      this.startAddGeofence(this.selectedDevice);
      this.FormVisible = false;
      this.visibleGeofence = false;

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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

