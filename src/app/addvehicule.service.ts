import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Device } from './vehicule.service';

@Injectable({
  providedIn: 'root'
})
export class AddvehiculeService {
  private apiUrl = 'http://localhost:8082/api/devices'

  constructor( private http: HttpClient) { }
  addveh( device: Device){

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin@poste.tn:rp2025')
    });
    if (device.id) {
      return this.http.put(this.apiUrl + "/" + device.id, device, { headers});
    } else {
      return this.http.post(this.apiUrl, device, { headers});
    }

  }
}
