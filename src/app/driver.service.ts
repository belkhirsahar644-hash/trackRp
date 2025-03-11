import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private apiUrl = 'http://localhost:8082/api/drivers'; // Remplace par ton URL Traccar

  constructor(private http: HttpClient) {}

  addDriver(name: string, uniqueId: string): Observable<any> {
    const driverData = {
      id: 0,
      name: name,
      uniqueId: uniqueId,
      attributes: {}
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin@poste.tn:rp2025') // Modifier selon ton authentification
    });

    return this.http.post(this.apiUrl, driverData, { headers });
  }}
