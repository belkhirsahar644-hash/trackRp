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
