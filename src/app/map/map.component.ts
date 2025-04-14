import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';
import { MapService } from '../services/map.service';
import { LayoutService } from '../services/layout.service';
import { Subscription } from 'rxjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ActivatedRoute } from '@angular/router';

dayjs.extend(utc);

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
  deviceId: number | null = null;

  @ViewChild('map')
  // Référence à l'élément HTML contenant la carte
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(private mapService: MapService, private layoutService: LayoutService, private route: ActivatedRoute) {}
  //appelé lors de l'initialisation du composant
  ngOnInit(): void {
    //Récupère l'ID du véhicule depuis l'URL
    const deviceIdParam = this.route.snapshot.paramMap.get('deviceId');
    if (deviceIdParam) {
      this.deviceId = parseInt(deviceIdParam, 10);
      console.log("l'ID est trouvé", this.deviceId);
    } else {
      this.deviceId = null;
      console.log("l'ID n'est pas trouvé");
    }

    // Abonnement à la période sélectionnée
    this.periodSub = this.layoutService.period$.subscribe(period => {
      this.selectedPeriod = period;
      if (this.map?.isStyleLoaded()) {
        this.loadRoute();
      }
    });

  }

  //appelé une fois que le composant est inséré dans le DOM
  ngAfterViewInit(): void {
    //Initialise la carte MapLibre
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    //controle de navigation
    this.map.addControl(new NavigationControl({}), 'top-right');

    // Quand la carte est prête, charger le trajet
    this.map.on('load', () => {
      this.loadRoute();
    });

  }

  //Supprime les anciennes couches (route et points) de la carte
  private clearPreviousRoute(): void {
    if (this.map?.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }
    if (this.map?.getSource('points')) {
      this.map.removeLayer('points');
      this.map.removeSource('points');
    }
  }

  private loadRoute(): void {
    if (!this.deviceId) {
      console.error("Aucun ID de véhicule fourni");
      return;
    }

    if (!this.map || !this.map.isStyleLoaded()) {
      console.warn('Carte non prête, style pas encore chargé');
      return;
    }

    const { from, to } = this.getPeriodDates(this.selectedPeriod);

    this.clearPreviousRoute();

    // Supprimer le marqueur précédent s’il existe
    if (this.marker) {
      this.marker.remove();
      this.marker = undefined;
    }

    this.mapService.getRouteReport(this.deviceId, from, to).subscribe((positions) => {
      if (positions && positions.length > 0) {
        const last = positions[positions.length - 1];
        console.log("Première position :", positions[0]);

        this.marker = new Marker({ color: '#FF0000' })
          .setLngLat([last.longitude, last.latitude])
          .addTo(this.map!);

        this.map?.flyTo({
          center: [last.longitude, last.latitude],
          essential: true
        });

        const coordinates = positions.map((p) => [p.longitude, p.latitude]);

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

      } else {
        alert("Aucune position trouvée pour cette période.");
        // Le marqueur a déjà été supprimé plus haut
      }
    });
  }

  private getPeriodDates(period: string): { from: string, to: string } {
    const now = dayjs().utc();
    let from = now.startOf('day');
    let to = now.endOf('day');

    switch (period) {
      case 'yesterday':
        const yesterday = dayjs().utc().subtract(1, 'day');
        from = yesterday.startOf('day');
        to = yesterday.endOf('day');
        break;
      case 'this_week':
        from = now.startOf('week');
        to = now.endOf('week');
        break;
      case 'last_week':
        const lastWeek = now.subtract(1, 'week');
        from = lastWeek.startOf('week');
        to = lastWeek.endOf('week');
        break;
      case 'this_month':
        from = now.startOf('month');
        to = now.endOf('month');
        break;
      case 'last_month':
        const lastMonth = now.subtract(1, 'month');
        from = lastMonth.startOf('month');
        to = lastMonth.endOf('month');
        break;
      case 'custom':

        const custom = this.layoutService.getCustomPeriod();
        if (custom) {
          from = dayjs(custom.from);
          to = dayjs(custom.to);
        }
        break;
        break;
    }

    console.log(`[Période sélectionnée: ${period}]`);
    console.log(`From: ${from.toISOString()}`);
    console.log(`To:   ${to.toISOString()}`);

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
