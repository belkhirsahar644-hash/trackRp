/*
//code enfant avec map
import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MapHomeService } from '../../services/map-home.service';
import * as turf from '@turf/turf';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';

type Type = 'Zone identifié' | 'Zone autorisé';

@Component({
  selector: 'app-geofence',
  standalone: false,
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.scss']
})
export class GeofenceComponent implements OnChanges {
  @Input() visible = false;
  @Input() device: any;
  @Input() map!: MapLibreMap;


  @Output() closeDrawer = new EventEmitter<void>();


  geofences: any[] = [];
  FormVisible = false;
  tempShapeId: string | null = null;

  private fb = inject(FormBuilder);

  trackByGeofenceId(index: number, geofence: any): number {
    return geofence.id;
  }

  validateForm = this.fb.group({
    nom: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<Type | null>('Zone identifié', Validators.required),
    radius: this.fb.control<number | null>(500, [Validators.required, Validators.min(1)])
  });

  constructor(
    private httpClient: HttpClient,
    private mapHomeService: MapHomeService
  ) {}

  ngOnChanges(): void {
    if (this.visible && this.device && this.map) {
      this.loadGeofences(this.device.deviceId);
    } else {
      console.error('Carte ou device non disponible');
    }
  }

  close(): void {
    this.closeDrawer.emit();
  }

  toggleForm(): void {
    this.FormVisible = !this.FormVisible;
  }

  AjouterForm(): void {
    if (this.validateForm.valid && this.device) {
      this.FormVisible = false;
      this.enableMapClickToDraw();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
    }
  }

  enableMapClickToDraw(): void {
    const radiusInMeters = this.validateForm.value.radius!;
    const name = this.validateForm.value.nom!;
    const type = this.validateForm.value.type!;
    const deviceId = this.device.deviceId;

    const mapClickHandler = (e: any) => {
      const center = [e.lngLat.lng, e.lngLat.lat];

      // Supprimer la forme temporaire précédente si elle existe
      if (this.tempShapeId && this.map.getSource(this.tempShapeId)) {
        this.map.removeLayer(this.tempShapeId);
        this.map.removeSource(this.tempShapeId);
      }

      // Créer une géométrie de cercle avec Turf.js
      const circle = turf.circle(center, radiusInMeters / 1000, {
        steps: 64,
        units: 'kilometers',
      });

      // ID unique pour la source/layer
      this.tempShapeId = `geofence-${Date.now()}`;


      if (!this.map || typeof this.map.addSource !== 'function') {
        console.error('Map instance is not valid or not yet loaded.');
        return;
      }

      this.map.addSource(this.tempShapeId, {
        type: 'geojson',
        data: circle,
      });

      this.map.addLayer({
        id: this.tempShapeId,
        type: 'fill',
        source: this.tempShapeId,
        layout: {},
        paint: {
          'fill-color': '#FFA500',
          'fill-opacity': 0.4,
        },
      });

      // Sauvegarde côté serveur ou en mémoire
      const newGeofence = {
        name,
        type,
        deviceId,
        center,
        radius: radiusInMeters,
      };

      this.httpClient.post('/api/geofences', newGeofence).subscribe(() => {
        this.loadGeofences(deviceId); // recharger la liste
      });

      // Désactiver l'écouteur après un clic
      this.map.off('click', mapClickHandler);
    };

    // Ajouter un seul clic pour dessiner le cercle
    this.map.once('click', mapClickHandler);
  }


  createGeofence(area: string, name: string): void {
    const body = {
      name: name,
      description: name,
      area: area
    };

    this.mapHomeService.createGeofence(body).subscribe((geofence: any) => {
      this.mapHomeService.linkDeviceToGeofence(geofence.id, this.device.deviceId).subscribe(() => {
        this.geofences.push(geofence);
        this.drawGeofenceOnMap(geofence);
      });
    });
  }

  drawGeofenceOnMap(geofence: any): void {
    const match = /CIRCLE\((-?\d+\.\d+) (-?\d+\.\d+), (\d+)\)/.exec(geofence.area);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      const radius = parseInt(match[3], 10);
      const shapeId = `geofence-${geofence.id}`;

      const circle = turf.circle([lng, lat], radius, {
        steps: 64,
        units: 'meters'
      });

      this.map.addSource(shapeId, {
        type: 'geojson',
        data: circle
      });

      this.map.addLayer({
        id: shapeId,
        type: 'fill',
        source: shapeId,
        paint: {
          'fill-color': '#3b9ddd',
          'fill-opacity': 0.3
        }
      });
    }
  }

  loadGeofences(deviceId: number): void {
    this.mapHomeService.getGeofencesByDeviceId(deviceId).subscribe((data) => {
      this.geofences = data;
      this.geofences.forEach(geofence => this.drawGeofenceOnMap(geofence));
    });
  }
}
*/
import {Component, EventEmitter, OnChanges ,inject, Input, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
type Type = 'Zone identifié' | 'Zone autorisé';
import {MapHomeService} from '../../services/map-home.service';
import {Position, Device} from '../../models/models.model';

@Component({
  selector: 'app-geofence',
  standalone: false,
  templateUrl: './geofence.component.html',
  styleUrl: './geofence.component.scss'
})
export class GeofenceComponent implements  OnChanges{
  @Input() visible = false;
  @Input() device!: Device;
  @Input() map: any;
  @Input() position!: Position;
  @Output() closeDrawer = new EventEmitter<void>();

  geofences: any[] = [];
  FormVisible = false;
  private fb = inject(FormBuilder);


  constructor(
              private mapHomeService: MapHomeService,) {
  }
  validateForm = this.fb.group({
    nom: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<Type | null>(null, Validators.required),
    radius: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)])
  });

  trackByGeofenceId(index: number, geofence: any): number {
    return geofence.id; // Utilisez un identifiant unique pour chaque geofence.
  }

  ngOnChanges() {
    console.log('OnChanges - visible:', this.visible, 'device:', this.device);

    if (this.visible && this.position.deviceId) {
      this.loadGeofences(this.position.deviceId);
    } else {
      console.log('Drawer non visible ou device null');
    }
  }

  close(): void {
    this.closeDrawer.emit();
  }

  ShowForm() {
    this.FormVisible = !this.FormVisible;
  }

  loadGeofences(deviceId: number): void {
    console.log('Chargement des geofences pour deviceId:', deviceId);

    this.mapHomeService.getGeofencesByDeviceId(deviceId).subscribe(
      (data) => {
        this.geofences = data;
        console.log('Geofences récupérés:', data);

      }
    )}


  AjouterForm(): void {
    if (this.validateForm.valid && this.device) {
      //this.startAddGeofence(this.device);
      this.FormVisible = false;
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

}
