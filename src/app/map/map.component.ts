import {Component, OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  marker: Marker | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl({}), 'top-right');

    this.marker = new Marker({ color: '#FF0000' })
      .setLngLat([initialState.lng, initialState.lat])
      .addTo(this.map);

    this.map.on('load', () => {
      this.loadRoute();
    });
  }

  private loadRoute(): void {
    const deviceId = 77;
    const from = '2025-04-08T00:00:00Z';
    const to = '2025-04-09T00:00:00Z';

    this.mapService.getRouteReport(deviceId, from, to).subscribe((positions) => {
      if (positions && positions.length > 0) {
        // Met à jour le marqueur à la première position
        const first = positions[0];
        this.updateMarker(first.latitude, first.longitude);

        // Crée les coordonnées pour la ligne
        const coordinates = positions.map((p) => [p.longitude, p.latitude]);

        // Ajoute la source GeoJSON si elle n'existe pas
        if (!this.map?.getSource('route')) {
          this.map?.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              },
              properties: {}
            }
          });

          // Ajoute la couche de ligne
          this.map?.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#0074D9',
              'line-width': 4
            }
          });
        } else {
          // Met à jour la source GeoJSON si elle existe déjà
          (this.map.getSource('route') as any).setData({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          });
        }
      }
    });
  }

  private updateMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
      this.map?.flyTo({ center: [lng, lat], essential: true });
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}

/*import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl , Marker} from 'maplibre-gl';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  marker: Marker | undefined;
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  constructor( private mapService: MapService) { }

  ngOnInit(): void {

  this.mapService.getPositions().subscribe(positions => {
      console.log(positions);
          if (positions && positions[0].latitude && positions[0].longitude) {
            this.updateMarker(positions[0].latitude, positions[0].longitude);
          }
        });

  }

  ngAfterViewInit() {

    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
    //NavigationControl
    this.map.addControl(new NavigationControl({}), 'top-right');

    //marker
    this.marker= new Marker({color: "#FF0000"})

    .setLngLat([10.1729, 36.8702,])
    .addTo(this.map);

}

private updateMarker(lat: number, lng: number): void {
  if (this.marker) {
    this.marker.setLngLat([lng, lat]);
    this.map?.flyTo({ center: [lng, lat], essential: true });
  }
}
ngOnDestroy() {
  this.map?.remove();
}
}

*/
