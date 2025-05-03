import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import { Subscription } from 'rxjs';
import { MapHomeService } from '../../services/map-home.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-home',
  standalone: false,
  templateUrl: './map-home.component.html',
  styleUrls: ['./map-home.component.scss']
})

export class MapHomeComponent implements AfterViewInit,OnChanges, OnDestroy {

  map: MapLibreMap | undefined; // Pour stocker l'objet carte
  private deviceMarkers: Map<number, Marker> = new Map<number, Marker>();
  private positionsSubscription: Subscription | undefined;
  private currentDeviceMarker: Marker | null = null; // Pour stocker le marqueur du device suivi

  @ViewChild('map') private mapContainer!: ElementRef<HTMLElement>;

  @Input() selectedDeviceId: number | null = null;
  @Input() resetMapView: boolean = false;
  @Output() mapResetDone = new EventEmitter<void>();

  modalVisible = false;
  selectedPosition: any = null;

  constructor(
    private mapHomeService: MapHomeService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetMapView'] && this.resetMapView === true) {
      this.resetToInitialView();
      this.mapResetDone.emit(); // Notifie le parent qu’on a fini
    }

    if (changes['selectedDeviceId'] && this.selectedDeviceId !== null) {
      this.centerMapOnDevice(this.selectedDeviceId);
    }
  }

  resetToInitialView(): void {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };
    this.map?.flyTo({
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      speed: 1.2
    });
  }


  centerMapOnDevice(deviceId: number) {
    const marker = this.deviceMarkers.get(deviceId);
    if (marker) {
      const lngLat = marker.getLngLat();
      this.map?.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 15,
        speed: 1.2
      });
    } else {
      console.warn(`Device ${deviceId} non trouvé sur la carte.`);
    }
  }

  ngAfterViewInit() {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 5 };

    this.map = new MapLibreMap({
      container: this.mapContainer.nativeElement,
      style: `https://tiles.stadiamaps.com/styles/osm_bright.json`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    // Navigation control
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
            carIcon.src = position.attributes.status
              ? 'https://cdn-icons-png.flaticon.com/512/4042/4042715.png'
              : 'https://cdn-icons-png.flaticon.com/512/2813/2813010.png';
            carIcon.style.width = '50px';
            carIcon.style.height = '50px';
            carIcon.style.cursor = 'pointer';



            carIcon.addEventListener('click', () => {
              this.showModal(position);
            });

            const marker = new Marker({ element: carIcon })
              .setLngLat([position.longitude, position.latitude])
              .addTo(this.map!);

            // Mise à jour du marqueur suivi
            if (this.selectedDeviceId === deviceId) {
              this.updateCurrentDeviceMarker(marker, position);
            }

            this.deviceMarkers.set(deviceId, marker);
          });
        }
      );
    });
  }

  updateCurrentDeviceMarker(marker: Marker, position: any) {
    // Si un marqueur de l'appareil est déjà présent, on le met à jour
    if (this.currentDeviceMarker) {
      this.currentDeviceMarker.setLngLat([position.longitude, position.latitude]);
    } else {
      this.currentDeviceMarker = marker;
    }

    // Centrer la carte sur le nouveau marqueur
    this.map?.flyTo({
      center: [position.longitude, position.latitude],
      zoom: 15,
      speed: 1.2
    });
  }

  showModal(position?: any): void {
    this.selectedPosition = position ?? null;
    this.modalVisible = true;
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
