import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
export interface Driver {
  "id"?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  driver: true
}

@Injectable({
  providedIn: 'root'
})
export class ConducteursService {
    constructor(private http: HttpClient) {}
  getDriver(){
    const params = new HttpParams().set('driver', 'true');
    return this.http.get<Driver[]>(`${environment.apiURL}users`, { params } )
  }
  deleteDriver(driver: Driver){
    return this.http.delete(environment.apiURL + "users/" + driver.id,   );
  }

}
