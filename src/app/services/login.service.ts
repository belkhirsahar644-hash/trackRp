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
