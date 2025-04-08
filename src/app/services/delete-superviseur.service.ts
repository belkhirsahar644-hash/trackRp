import { Injectable } from '@angular/core';
import { Superviseur } from './superviseur.service';
import { HttpClient,  } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class DeleteSuperviseurService {

    constructor( private http: HttpClient) { }
    deleteSup(superviseurs: Superviseur){
      return this.http.delete(environment.apiURL + "users/" + superviseurs.id,  );
    }
}
