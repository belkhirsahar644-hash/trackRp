import { Injectable } from '@angular/core';
import { Superviseur } from './superviseur.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddsupervieurService {


  constructor( private http: HttpClient) { }
  addSuperviseur( superviseur: Superviseur){

    if (superviseur.id) {
        return this.http.put(environment.apiURL + "users/" + superviseur.id, superviseur, );
      } else {
        return this.http.post(environment.apiURL + "users/" , superviseur,);
      }

    }
}
