import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8082/api/session';  // URL de votre serveur Traccar

  constructor(private http: HttpClient) { }

  // Connexion
  login(email: string, password: string): Observable<any> {
    // Créer l'objet HttpParams pour envoyer les données dans le format 'x-www-form-urlencoded'
    const body = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post(environment.apiURL + "session" ,body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      withCredentials: true // Inclure les cookies de session
    });
  }
}
/*
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('email', email)
      .set('password', password);


    return this.http.post(`${environment.apiURL}token`  , body, { headers, responseType: 'text' })
      .pipe(
        tap(response => {
          console.log('Token reçu:', response);

          if (response) {
            localStorage.setItem('token', response);
          } else {
            console.error('Aucun token reçu');
          }
        }),
        catchError(error => {
          console.error('Erreur lors de la requête:', error);
          return throwError(error);
        })

      );
  }

  deleteToken(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
*/
