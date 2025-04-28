import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export interface Notification {
  "id"?: number;
  description: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotif(){
    return this.http.get<Notification[]>(`${environment.apiURL}notifications`,)
  }

  deleteNotif(notif: Notification){
    return this.http.delete(environment.apiURL + "notifications/" + notif.id, );
  }

  addNotif(notif: Notification){
    if (notif.id){
      return this.http.put(environment.apiURL + "notifications/" + notif.id, notif,);
    } else {
      return this.http.post(environment.apiURL + "notifications/" ,notif, )
    }
  }

}
