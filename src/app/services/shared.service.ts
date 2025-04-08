import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public apiUrl = 'http://localhost:8082/api/token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new HttpParams()
      .set('email', email)
      .set('password', password);


    return this.http.post(this.apiUrl  , body, { headers, responseType: 'text' })
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

