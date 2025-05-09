export interface Driver {
  id?: number;       // ID optionnel, généré par le backend
  name: string;      // Nom du conducteur
  email: string;     // Email du conducteur
  phone: string;     // Numéro de téléphone
  vehicleId: number; // ID du véhicule attribué au conducteur
}

export class Position {
  id!: number;
  attributes!: PositionAttributes;
  deviceId!: number;
  protocol!: string;
  serverTime!: Date;
  deviceTime!: Date;
  fixTime!: Date;
  outdated!: boolean;
  valid!: boolean;
  latitude!: number;
  longitude!: number;
  altitude!: number;
  speed!: number;
  course!: number;
  address!: string;
  accuracy!: number;
  network!: string;
  geofenceIds!: number[];
  deviceName!: string;
  uniqueId!: string;
  model!: string;
  nameDriver!: string;
  status!: string;
}

export class PositionAttributes {
  ignition!: boolean;
  status!: number;
  io1!: string;
  io2!: string;
  io3!: string;
  io4!: string;
  io5!: string;
  io6!: string;
  io7!: string;
  distance!: number;
  totalDistance!: number;
  motion!: boolean;
  batteryLevel!: number;
}

export class Device {
  id!: number;
  attributes!: DeviceAttributes;
  groupId!: number;
  calendarId!: number;
  name!: string;
  uniqueId!: string;
  status!: string;
  lastUpdate!: Date;
  positionId!: number;
  phone!: string;
  model!: string;
  contact!: string;
  category!: string;
  disabled!: boolean;
  expirationTime!: any;
}

export class DeviceAttributes {
  nameDriver!: string;
  carNumber!: string;
  speedLimit!: string;
}

export class EnrichedPosition {
  position!: Position;
  device!: Device;
}

