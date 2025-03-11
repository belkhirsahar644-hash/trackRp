import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export interface superviseur{
  id: number;
  name: string;
  email: string;
  phone: string;

}

@Injectable({
  providedIn: 'root'
})
export class SuperviseurService {

  constructor() { }
}

/*
{
  "id": 0,
  "name": "string",
  "email": "string",
  "phone": "string",
  "readonly": true,
  "administrator": true,
  "map": "string",
  "latitude": 0,
  "longitude": 0,
  "zoom": 0,
  "password": "string",
  "coordinateFormat": "string",
  "disabled": true,
  "expirationTime": "2019-08-24T14:15:22Z",
  "deviceLimit": 0,
  "userLimit": 0,
  "deviceReadonly": true,
  "limitCommands": true,
  "fixedEmail": true,
  "poiLayer": "string",
  "attributes": {}
}
*/
