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
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    private mapService: MapService,
    private layoutService: LayoutService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const deviceIdParam = this.route.snapshot.paramMap.get('deviceId');
    if (deviceIdParam) {
      this.deviceId = parseInt(deviceIdParam, 10);
      console.log(" ID trouvé :", this.deviceId);
    } else {
      console.log(" Aucun ID trouvé dans l'URL.");
      this.deviceId = null;
    }

    // écoute du changement de période (today, yesterday, etc.)
    this.periodSub = this.layoutService.period$.subscribe(period => {
      this.selectedPeriod = period;
      if (this.map?.isStyleLoaded()) {
        this.loadRoute();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialisation de la carte MapLibre
    const initialState = { lng: 10.1729, lat: 36.8702, zoom: 14 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=sFhBT3kZc5gtzUAEukg8`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    this.map.addControl(new NavigationControl(), 'top-right');

    this.map.on('load', () => {
      this.loadRoute();
    });
  }

  // Nettoyer les anciennes couches sur la carte
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

  // Charger les données de trajet
  private loadRoute(): void {
    if (!this.deviceId) {
      console.error("❌ Aucun ID de véhicule fourni.");
      return;
    }

    if (!this.map || !this.map.isStyleLoaded()) {
      console.warn("⚠️ Carte non prête.");
      return;
    }

    const { from, to } = this.getPeriodDates(this.selectedPeriod);
    this.clearPreviousRoute();

    if (this.marker) {
      this.marker.remove();
      this.marker = undefined;
    }

    // Appel du service pour récupérer les données de trajet
    this.mapService.getRouteReport(this.deviceId, from, to).subscribe((positions: any[]) => {
      if (!positions || positions.length === 0) {
        alert("🚫 Aucune position trouvée pour cette période.");
        return;
      }

      console.log("📍 Positions reçues ");

      // Marqueur personnalisé
      const carIcon = document.createElement('img');
      carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
      carIcon.style.width = '40px';
      carIcon.style.height = '40px';

      const startPos = positions[0];
      this.marker = new Marker({ element: carIcon })
        .setLngLat([startPos.longitude, startPos.latitude])
        .addTo(this.map!);

      this.map?.flyTo({
        center: [startPos.longitude, startPos.latitude],
        essential: true
      });

      // Construction de la ligne GeoJSON à afficher
      const coordinates = positions.map(p => [p.longitude, p.latitude]);

      this.map?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates
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
          'line-color': 'green',
          'line-width': 4
        }
      });

      // Animation douce du marqueur
      this.animateMarkerSmoothly(positions);
    });
  }

  private animateMarkerSmoothly(positions: any[]): void {
    if (!this.marker || positions.length < 2) return;

    // ➤ Étape 1 : On enlève les positions consécutives identiques
    const filteredPositions = positions.filter((pos, index, arr) => {
      if (index === 0) return true;
      const prev = arr[index - 1];
      return pos.latitude !== prev.latitude || pos.longitude !== prev.longitude;
    });
    console.log("Positions totales :", positions.length);
    console.log("Après filtrage :", filteredPositions.length);


    // ➤ Si après filtrage il reste moins de 2 positions, pas d'animation possible
    if (filteredPositions.length < 2) return;

    let i = 0;
    const animate = () => {
      if (i >= filteredPositions.length - 1) return;

      const start = filteredPositions[i];
      const end = filteredPositions[i + 1];
      const steps = 100;
      let step = 0;

      const animateStep = () => {
        if (!this.marker) return;

        const lng = start.longitude + (end.longitude - start.longitude) * (step / steps);
        const lat = start.latitude + (end.latitude - start.latitude) * (step / steps);

        this.marker.setLngLat([lng, lat]);

        if (step < steps) {
          step++;
          requestAnimationFrame(animateStep);
        } else {
          i++;
          animate();
        }
      };

      animateStep();
    };

    animate();
  }


  // Déterminer les dates en fonction de la période sélectionnée
  private getPeriodDates(period: string): { from: string, to: string } {
    const now = dayjs().utc();
    let from = now.startOf('day');
    let to = now.endOf('day');

    switch (period) {
      case 'yesterday':
        const yesterday = now.subtract(1, 'day');
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
    }

    console.log(`[Période: ${period}]`, `From: ${from.toISOString()}`, `To: ${to.toISOString()}`);

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


/*import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
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
    //Récupère l'ID du véhicule dans  l'URL
    //this.route : donne l'accé aux paramétre dans l'url
    //snapshot.paramMap.get('deviceId'): lit ce paramétre
    const deviceIdParam = this.route.snapshot.paramMap.get('deviceId');
    if (deviceIdParam) { //string
      this.deviceId = parseInt(deviceIdParam, 10); //convertir en entier décimail
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
        // Création de l'icône voiture
        const carIcon = document.createElement('img');
        carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
        carIcon.style.width = '40px';
        carIcon.style.height = '40px';

        // Création du marqueur à la première position
        const startPos = positions[0];
        this.marker = new Marker({ element: carIcon })
          .setLngLat([startPos.longitude, startPos.latitude])
          .addTo(this.map!);

        // Centrer la carte sur le point de départ
        this.map?.flyTo({
          center: [startPos.longitude, startPos.latitude],
          essential: true
        });

        // Création de la ligne du trajet
        const coordinates = positions.map(p => [p.longitude, p.latitude]);

        this.map?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates
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

          // 👉 Animation du déplacement du marqueur
          this.animateMarkerSmoothly(positions);



        /*
        const last = positions[positions.length - 1];
        console.log("Première position :", positions[0]);

        const carIcon = document.createElement('img');
        carIcon.src = 'https://cdn-icons-png.flaticon.com/512/5412/5412275.png';
        carIcon.style.width = '40px';
        carIcon.style.height = '40px';

        this.marker = new Marker({ element: carIcon })
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
*/
  /*    } else {
        alert("Aucune position trouvée pour cette période.");
      }
    });
  }

  // 💡 Fonction pour animer le mouvement du marqueur
  private animateMarkerSmoothly(positions: any[]): void {
    if (!this.marker || positions.length < 2) return;

    let i = 0;

    const animate = () => {
      if (i >= positions.length - 1) return;

      const start = positions[i];
      const end = positions[i + 1];
      const steps = 100; // nombre d’étapes d’interpolation
      let step = 0;

      const animateStep = () => {
        if (!this.marker) return;

        const lng = start.longitude + (end.longitude - start.longitude) * (step / steps);
        const lat = start.latitude + (end.latitude - start.latitude) * (step / steps);

        this.marker.setLngLat([lng, lat]);

        if (step < steps) {
          step++;
          requestAnimationFrame(animateStep);
        } else {
          i++;
          animate(); // passe au point suivant
        }
      };

      animateStep();
    };

    animate();
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
*/
