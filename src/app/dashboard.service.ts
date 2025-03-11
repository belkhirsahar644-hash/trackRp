import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8082/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin@poste.tn:rp2025') // Remplace par tes identifiants
    })
  };

  constructor(private http: HttpClient) {}

  getDevices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/devices`, this.httpOptions);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, this.httpOptions);
  }

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/drivers`, this.httpOptions);
  }
}
