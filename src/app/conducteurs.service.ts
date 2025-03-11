import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces pour définir les types des données
export interface Device {
  id: number;
  model: string;
  groupId: number;
  uniqueId: string;
  status: string;
}

export interface Permission {
  deviceId: number;
  driverId?: number;
}

export interface Conducteur {
  model: string;
  centre: number;
  matricule: string;
  statut: string;
  driverId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ConducteursService {
  private apiUrl = 'http://localhost:8082/api';
  private headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('admin@poste.tn:rp2025'));

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des véhicules et leurs conducteurs associés
   */
  getConducteurs(): Observable<[Device[], Permission[]]> {
    const devicesRequest = this.http.get<Device[]>(`${this.apiUrl}/devices`, { headers: this.headers })
      .pipe(catchError(error => {
        console.error('❌ Erreur lors de la récupération des véhicules', error);
        return of([]);
      }));

    const permissionsRequest = this.http.get<Permission[]>(`${this.apiUrl}/permissions`, { headers: this.headers })
      .pipe(catchError(error => {
        console.error('❌ Erreur lors de la récupération des permissions', error);
        return of([]);
      }));

    return forkJoin([devicesRequest, permissionsRequest]);
  }

  /**
   * Associe chaque véhicule à un conducteur
   */
  mapConducteurs(devices: Device[], permissions: Permission[]): Conducteur[] {
    return devices.map((device: Device) => {
      const permission = permissions.find((p: Permission) => p.deviceId === device.id);
      return {
        model: device.model,
        centre: device.groupId,
        matricule: device.uniqueId,
        statut: device.status,
        driverId: permission ? permission.driverId : null
      };
    });
  }
}
