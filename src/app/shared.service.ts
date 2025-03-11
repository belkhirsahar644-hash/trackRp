      import { Injectable } from '@angular/core';
      import { HttpClient, HttpHeaders } from '@angular/common/http';
      import { Observable } from 'rxjs';
      import { HttpParams } from '@angular/common/http';

      @Injectable({
        providedIn: 'root'
      })
      export class SharedService {
        public url: string;

        constructor(private http: HttpClient) {
          this.url = 'http://localhost:8082/api/session';  
        }

        login(email: string, password: string): Observable<any> {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          });

          // Créer un objet HttpParams pour formater les données
          const body = new HttpParams()
            .set('email', email)
            .set('password', password);

          return this.http.post(this.url, body, { headers, withCredentials: true });
        }
      }

