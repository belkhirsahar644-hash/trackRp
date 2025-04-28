/*import {
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
*/
//dernier version

import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject
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
export class MapHomeComponent implements AfterViewInit, OnDestroy {
  map: MapLibreMap | undefined; // Pour stocker l'objet carte
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  modalVisible = false;
  selectedDevice: any = null;
  addingGeofence = false;
  selectedGeofenceDevice: any = null;

  tempShapeId: string | null = null; // Pour stocker l'id du cercle ou polygone temporaire

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

    // Navigation control
    this.map.addControl(new NavigationControl({}), 'top-right');

    // Gestion clic sur la carte pour dessiner une geofence
    this.map.on('click', (e) => {
      if (this.addingGeofence) {
        const center = [e.lngLat.lng, e.lngLat.lat];
        const radiusInMeters = 800; // Rayon fixe pour un cercle

        // Supprimer le cercle ou le polygone précédent s'il existe
        if (this.tempShapeId && this.map!.getSource(this.tempShapeId)) {
          this.map!.removeLayer(this.tempShapeId);
          this.map!.removeSource(this.tempShapeId);
        }

        const shapeId = `shape-${Date.now()}`;
        this.tempShapeId = shapeId;

        if (this.validateForm.value.type === 'Zone autorisé') {
          // Zone autorisé - Polygone autour du centre
          const polygon = turf.polygon([[
            [center[0] - 0.0001, center[1] - 0.0001],
            [center[0] + 0.0001, center[1] - 0.0001],
            [center[0] + 0.0001, center[1] + 0.0001],
            [center[0] - 0.0001, center[1] + 0.0001],
            [center[0] - 0.0001, center[1] - 0.0001]
          ]]);

          // Ajouter la source du polygone
          this.map!.addSource(shapeId, {
            type: 'geojson',
            data: polygon
          });

          // Ajouter la couche polygone
          this.map!.addLayer({
            id: shapeId,
            type: 'fill',
            source: shapeId,
            paint: {
              'fill-color': '#ff7f00',
              'fill-opacity': 0.4
            }
          });

          const area = `POLYGON((${polygon.geometry.coordinates[0].map(coord => coord.join(' ')).join(', ')}))`;

          // Envoi de la géofence à l'API
          this.createGeofence(area, 'Zone polygonale autour du dépôt');
        } else {
          // Zone identifié - Cercle autour du centre
          const circle = turf.circle(center, radiusInMeters, {
            steps: 64,  // Plus de steps, cercle plus lisse
            units: 'meters'
          });

          // Ajouter la source du cercle
          this.map!.addSource(shapeId, {
            type: 'geojson',
            data: circle
          });

          // Ajouter la couche cercle
          this.map!.addLayer({
            id: shapeId,
            type: 'fill',
            source: shapeId,
            paint: {
              'fill-color': '#3b9ddd',
              'fill-opacity': 0.4
            }
          });

          const area = `CIRCLE(${center[0]} ${center[1]}, ${radiusInMeters})`;

          // Envoi de la géofence à l'API
          this.createGeofence(area, 'Zone identifiée autour du dépôt');
        }
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
            carIcon.src = position.status === 'offline'
              ? 'https://cdn-icons-png.flaticon.com/512/4042/4042715.png'
              : 'https://cdn-icons-png.flaticon.com/512/2813/2813010.png';
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
              status: position.status
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

  handleCancel(): void {
    this.modalVisible = false;
  }

  visibleGeofence = false;

  showGeofence(): void {
    this.modalVisible = false;
    this.visibleGeofence = true;
    if (this.selectedDevice) {
      this.loadGeofences(this.selectedDevice.deviceId);
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

  FormVisible = false;
  ShowForm() {
    this.FormVisible = !this.FormVisible;
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

  createGeofence(area: string, description: string): void {
    const newGeofence = {
      name: this.validateForm.value.nom,
      area: area,
      description: description,
      calendarId: 0
    };

    this.http.post('http://localhost:8082/api/geofences', newGeofence).subscribe({
      next: (response: any) => {
        this.http.post('http://localhost:8082/api/permissions', {
          deviceId: this.selectedGeofenceDevice.deviceId,
          geofenceId: response.id
        }).subscribe(() => {
          alert('Zone ajoutée avec succès !');
          this.resetTempShape();
          this.addingGeofence = false;
          this.selectedGeofenceDevice = null;
        });
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la création de la zone');
        this.resetTempShape();
        this.addingGeofence = false;
        this.selectedGeofenceDevice = null;
      }
    });
  }

  resetTempShape(): void {
    if (this.tempShapeId && this.map!.getSource(this.tempShapeId)) {
      this.map!.removeLayer(this.tempShapeId);
      this.map!.removeSource(this.tempShapeId);
      this.tempShapeId = null;
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

