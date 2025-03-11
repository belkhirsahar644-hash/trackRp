import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs';

export interface Device {
  id?: number;
  model: string;
  groupId?: number;
  uniqueId: string;
  name: string;
  status?: string;
}
/*
{
  "id": 0,
  "name": "string",
  "uniqueId": "string",
  "status": "string",
  "disabled": true,
  "lastUpdate": "2019-08-24T14:15:22Z",
  "positionId": 0,
  "groupId": 0,
  "phone": "string",
  "model": "string",
  "contact": "string",
  "category": "string",
  "attributes": {}
}
*/

export interface Permission {
  deviceId: number;
  driverId?: number;
}

export interface Conducteur {
  model: string;
  marque: string;
  centre?: number;
  matricule: string;
  statut?: string;
  driverId?: number | null;
}
@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = 'http://localhost:8082/api';
  private headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('admin@poste.tn:rp2025'));
  constructor(private http: HttpClient) { }

  getDevices() {
    return this.http.get<Device[]>(`${this.apiUrl}/devices`, { headers: this.headers })
  }
  //L'Observable permet d'écouter la réponse de l'API et d'agir quand les données sont reçues.
  getVehicule(): Observable<[Device[], Permission[]]> {// retourne un observable contenanat un tableau de 2 listes
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
        //utilisée pour exécuter plusieurs Observables en parallèle et attendre qu'ils soient tous terminés avant de retourner leurs résultats.
        return forkJoin([devicesRequest, permissionsRequest]);
  }

  associer(devices: Device[], permissions: Permission[]): Conducteur[] {
      return devices.map((device: Device) => {
        const permission = permissions.find((p: Permission) => p.deviceId === device.id);
        return {
          marque: device.name,
          model: device.model,
          centre: device.groupId,
          matricule: device.uniqueId,
          statut: device.status,
          driverId: permission ? permission.driverId : null
        };
      });
    }


    }
