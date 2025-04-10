import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { MapService } from '../services/map.service';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import dayjs from 'dayjs';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  map: Map | undefined;
  marker: Marker | undefined;
  periodSub!: Subscription;
  selectedPeriod: string = 'today';

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private mapService: MapService, private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.periodSub = this.layoutService.period$.subscribe(period => {
      this.selectedPeriod = period;
      if (this.map?.isStyleLoaded()) {
        this.loadRoute();
      }
    });
  }

  ngAfterViewInit(): void {
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    //Contrôles de la carte
    this.map.addControl(new NavigationControl({}), 'top-right');

    //Marqueur de carte
    this.marker = new Marker({ color: '#FF0000' })
      .setLngLat([initialState.lng, initialState.lat])
      .addTo(this.map);

    // Ajouter un écouteur pour s'assurer que la carte est complètement chargée
    this.map.on('load', () => {
      this.loadRoute(); // charge les données et les ajoute à la carte
    });
  }

  private loadRoute(): void {
    if (!this.map || !this.map.isStyleLoaded()) {
      console.warn('Carte non prête, style pas encore chargé');
      return;
    }

    const deviceId = 77;
    const { from, to } = this.getPeriodDates(this.selectedPeriod);

    this.mapService.getRouteReport(deviceId, from, to).subscribe((positions) => {
      if (positions && positions.length > 0) {
        const first = positions[0];
        this.updateMarker(first.latitude, first.longitude);

        const coordinates = positions.map((p) => [p.longitude, p.latitude]);

        // Vérifier si la source existe avant de l'ajouter ou de la mettre à jour
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

  private getPeriodDates(period: string): { from: string, to: string } {

    const now = dayjs();//date et l'heure actuel
    let from = now.startOf('day');
    let to = now.endOf('day');

    switch (period) {
      case 'yesterday':
        from = now.subtract(1, 'day').startOf('day');
        to = now.subtract(1, 'day').endOf('day');
        break;
      case 'this_week':
        from = now.startOf('week');
        to = now.endOf('week');
        break;
      case 'last_week':
        from = now.subtract(1, 'week').startOf('week');
        to = now.subtract(1, 'week').endOf('week');
        break;
      case 'this_month':
        from = now.startOf('month');
        to = now.endOf('month');
        break;
      case 'last_month':
        from = now.subtract(1, 'month').startOf('month');
        to = now.subtract(1, 'month').endOf('month');
        break;
      case 'custom':
        // Ici, tu pourrais gérer une date personnalisée (à implémenter plus tard)
        break;
    }

    //On renvoie les deux dates au format ISO 8601 (ex. 2025-04-10T00:00:00.000Z),
    return {
      from: from.toISOString(),
      to: to.toISOString()
    };
  }



  ngOnDestroy(): void {
    this.periodSub?.unsubscribe();
    this.map?.remove();
  }
}
