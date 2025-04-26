import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapHomeService {
  private socket: WebSocket | undefined;
  private devicesMap: Map<number, any> = new Map();
  private fullDataSubject: Subject<any[]> = new Subject<any[]>();
  fullData$ = this.fullDataSubject.asObservable();

  private readonly baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  getGeofencesByDeviceId(deviceId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/geofences?deviceId=${deviceId}`);
  }
  private fetchDeviceById(deviceId: number): Promise<any> {
    const params = new HttpParams().set('id', deviceId.toString());
    return this.http.get<any[]>(`${this.baseUrl}/devices`, { params }).toPromise();
  }

  connectWebSocket() {
    this.socket = new WebSocket(`${this.baseUrl.replace('http', 'ws')}/socket`);

    this.socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.devices) {
        data.devices.forEach((device: any) => {
          this.devicesMap.set(device.id, device);
        });
      }

      if (data.positions) {
        const enrichedPositions = await Promise.all(
          data.positions.map(async (position: any) => {
            const deviceId = position.deviceId;
            let device = this.devicesMap.get(deviceId);

            if (!device) {
              try {
                const result = await this.fetchDeviceById(deviceId);
                device = result?.[0];
                if (device) {
                  this.devicesMap.set(device.id, device);
                }
              } catch (error) {
                console.error(`Erreur lors du fetch deviceId=${deviceId}`, error);
              }
            }

            return {
              ...position,
              deviceName: device?.name || 'Inconnu',
              uniqueId: device?.uniqueId || 'Inconnu',
              model: device?.model || 'Inconnu',
              nameDriver: device?.attributes?.nameDriver ?? 'Inconnu',
              status: device?.status ?? 'Offline',
            };
          })
        );

        this.fullDataSubject.next(enrichedPositions);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket closed', event);
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }
}


/*
//websoket
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapHomeService {
  private socket: WebSocket | undefined;
  private devicesMap: Map<number, any> = new Map(); // device.id => device
  private fullDataSubject: Subject<any[]> = new Subject<any[]>();
  fullData$ = this.fullDataSubject.asObservable();

  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:8082/api/socket');

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.devices) {
        data.devices.forEach((device: any) => {
          this.devicesMap.set(device.id, device);
        });
      }

      if (data.positions) {
        const enrichedPositions = data.positions.map((position: any) => {
          const device = this.devicesMap.get(position.deviceId);
          return {
            ...position,
            deviceName: device?.name || 'Inconnu',
            uniqueId: device?.uniqueId || 'Inconnu',
            model: device?.model || 'Inconnu' ,
            nameDriver: device?.attributes.nameDriver || 'Inconnu',
            status: device?.status || 'Offline',
          };
        });

        this.fullDataSubject.next(enrichedPositions);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket closed", event);
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
*/
/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapHomeService {

  private socket: WebSocket | undefined;
  private positionsSubject: Subject<any[]> = new Subject<any[]>(); // Subject pour émettre les données des positions
  positions$ = this.positionsSubject.asObservable(); // Observable pour s'abonner aux positions

  constructor() { }
  // Connecte le WebSocket et écoute les messages en temps réel
  connectWebSocket() {
    this.socket = new WebSocket('ws://localhost:8082/api/socket'); // Remplace par l'URL de ton serveur WebSocket

    // Quand un message est reçu via WebSocket
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.positions) {
        this.positionsSubject.next(data.positions); // Émettre les positions à tous les abonnés
      }
    };

    // Gérer les erreurs
    this.socket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    // Gérer la fermeture de la connexion WebSocket
    this.socket.onclose = (event) => {
      console.log("WebSocket closed", event);
    };
  }

// Ferme la connexion WebSocket
  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }


}
*/
