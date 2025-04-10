import { Injectable } from '@angular/core';
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
