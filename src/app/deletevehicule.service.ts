import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from './vehicule.service';
import { environment } from '../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DeletevehiculeService {
  constructor( private http: HttpClient) { }
  deleteVehicule(device: Device){
    return this.http.delete(environment.apiURL + "devices/" + device.id, );
  }

}
