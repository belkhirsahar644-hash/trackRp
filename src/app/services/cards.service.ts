import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Superviseur } from './superviseur.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor( private http: HttpClient) { }
  getSuperviseur( ){
      const params = new HttpParams().set('supervisor', 'true');
      return this.http.get<Superviseur[]>(`${environment.apiURL}users`, { params });
    }
  getDriver(){
        const params = new HttpParams().set('driver', 'true');
        return this.http.get<any[]>(`${environment.apiURL}users`, { params } )
      }
  getVehicule(){
    return this.http.get<any[]>(`${environment.apiURL}devices`)
  }

}
