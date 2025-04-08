import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs';
import { environment } from '../environments/environment.development';

export interface Device {
  "id"?: number;
  model: string;
  uniqueId: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  constructor(private http: HttpClient) { }
  getVehicule(){
    return this.http.get<Device[]>(`${environment.apiURL}devices`,)
  }

    }
