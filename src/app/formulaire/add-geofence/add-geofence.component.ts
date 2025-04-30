import { Component , EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Map as MapLibreMap, Marker, NavigationControl } from 'maplibre-gl';
import * as turf from '@turf/turf';
import { HttpClient } from '@angular/common/http';


type Type = 'Zone identifié' | 'Zone autorisé';
@Component({
  selector: 'app-add-geofence',
  standalone: false,
  templateUrl: './add-geofence.component.html',
  styleUrl: './add-geofence.component.scss'
})
export class AddGeofenceComponent {
  constructor(
    private http: HttpClient,
  ) {}
  @Input() map!: MapLibreMap;  // Assurez-vous que c'est bien une instance de MapLibreMap


  @Input() visible = false;
  @Input() device: any = null;
  @Output() onAdd = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  fb = inject(FormBuilder);
  validateForm = this.fb.group({
    nom: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<Type | null>(null, Validators.required)
  });

  submit(): void {
    if (this.validateForm.valid) {
      this.onAdd.emit({
        nom: this.validateForm.value.nom,
        type: this.validateForm.value.type
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  private tempShapeId: string | null = null;

  startListeningToMapClick() {
    const listener = (e: any) => {
      const center = [e.lngLat.lng, e.lngLat.lat];
      const radiusInMeters = 800;

      // Nettoyage de la zone précédente
      if (this.tempShapeId && this.map.getSource(this.tempShapeId)) {
        this.map.removeLayer(this.tempShapeId);
        this.map.removeSource(this.tempShapeId);
      }

      const shapeId = `shape-${Date.now()}`;
      this.tempShapeId = shapeId;

      const circle = turf.circle(center, radiusInMeters, {
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
          'fill-opacity': 0.4
        }
      });

      const wktArea = `CIRCLE(${center[0]} ${center[1]}, ${radiusInMeters})`;

      this.validateForm.patchValue({ nom: `Zone ${Date.now()}`, type: 'Zone identifié' });

      // Appel API ou émission de l'objet vers le parent
      this.createGeofence(wktArea);
      this.map.off('click', listener); // Désactiver après un clic
    };

    this.map.on('click', listener);
  }

  createGeofence(wktArea: string) {
    const geofence = {
      name: this.validateForm.value.nom,
      description: this.validateForm.value.type,
      area: wktArea,
      deviceId: this.device?.deviceId
    };

    this.http.post('/api/geofences', geofence).subscribe({
      next: () => {
        this.onAdd.emit(geofence);
      },
      error: (err) => {
        console.error('Erreur création geofence', err);
      }
    });
  }

  ngOnChanges() {
    if (this.visible && this.map) {
      this.startListeningToMapClick();
    }
  }


}
