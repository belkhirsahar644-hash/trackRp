import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Driver} from './conducteurs.service';
import { environment } from '../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DeleteConducteurService {


  constructor( private http: HttpClient) { }
  deleteDriver(driver: Driver){
    return this.http.delete(environment.apiURL + "users/" + driver.id,   );
  }
}
