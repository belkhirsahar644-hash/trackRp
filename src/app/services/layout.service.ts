import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

export interface Session {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // Période sélectionnée (today, this_week, etc.)
  private periodSubject = new BehaviorSubject<string>('today');
  period$ = this.periodSubject.asObservable();

  // Dates pour la période personnalisée
  private customPeriod: { from: string, to: string } | null = null;

  constructor(private http: HttpClient) { }

  getSession() {
    return this.http.get<Session>(`${environment.apiURL}session`);
  }

  // Setter pour les périodes standards
  setPeriod(period: string) {
    this.periodSubject.next(period);
    if (period !== 'custom') {
      this.customPeriod = null; // reset des anciennes dates custom
    }
  }

  // Setter pour période personnalisée
  setCustomPeriod(dates: { from: string, to: string }) {
    this.customPeriod = dates;
    this.periodSubject.next('custom');
  }

  // Getter utilisé dans le MapComponent
  getCustomPeriod(): { from: string, to: string } | null {
    return this.customPeriod;
  }
}

/*import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs'
export interface Session {
  "id"?: number;
  name: string;

}
@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private periodSubject = new BehaviorSubject<string>('today');//garde la période actuelle
  period$ = this.periodSubject.asObservable();//permet à d'autres composants de réagir automatiquement aux changements de période.


  setPeriod(period: string) {
    this.periodSubject.next(period);
  }


  constructor(private http: HttpClient) { }
  getSession(){
    return this.http.get<Session>(`${environment.apiURL}session`,)
  }
}
*/
