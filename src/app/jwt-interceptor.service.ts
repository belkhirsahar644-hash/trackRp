import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService  {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');  // Récupérer le token JWT du localStorage

    if (token && token !== 'null') {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req).pipe(
      catchError((error) => {
        console.error('Erreur HTTP dans l\'intercepteur :', error);
        throw error;
      })
    );  }
}

