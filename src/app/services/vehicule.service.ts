import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

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
  deleteVehicule(device: Device){
    return this.http.delete(environment.apiURL + "devices/" + device.id, );
  }

}
