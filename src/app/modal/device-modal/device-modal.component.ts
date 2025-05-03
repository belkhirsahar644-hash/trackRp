import {Component, EventEmitter, Input, Output,  OnChanges} from '@angular/core';

@Component({
  selector: 'app-device-modal',
  standalone: false,
  templateUrl: './device-modal.component.html',
  styleUrl: './device-modal.component.scss'
})
export class DeviceModalComponent  implements OnChanges{
  @Input() map: any;
  @Input() Modalvisible = false;
  @Input() device: any = null;
  @Output() close = new EventEmitter<void>();
  @Input() position: any;



  get deviceData() {
    return {
      deviceId: this.position.deviceId,
      name: this.position.deviceName,
      uniqueId: this.position.uniqueId,
      model: this.position.model,
      nameDriver: this.position.nameDriver,
      latitude: this.position.latitude,
      longitude: this.position.longitude,
      speed: this.position.speed,
      distance: this.position.attributes?.totalDistance,
      battery: this.position.attributes?.batteryLevel,
      status: this.position.status
    };
  }

  ngOnChanges() {
    if (this.position && (!this.device || this.device.deviceId !== this.position.deviceId)) {
      this.device = {
        deviceId: this.position.deviceId,
      };
    }
  }



  handleCancel() {
    this.close.emit();
  }
  geofenceDrawerVisible = false;

  openGeofenceDrawer(): void {

    if (this.device && this.device.deviceId) {
      console.log('Device envoyé au drawer:', this.device);
      this.geofenceDrawerVisible = true;
      this.Modalvisible = false;
    } else {
      console.warn('Device non défini, drawer bloqué');
    }
  }

}
