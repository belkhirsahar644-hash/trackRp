import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
export interface Session {
  "id"?: number;
  name: string;

}
@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }
  getSession(){
    return this.http.get<Session>(`${environment.apiURL}session`,)
  }
}
