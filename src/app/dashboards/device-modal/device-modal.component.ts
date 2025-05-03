import { Component , Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-device-modal',
  standalone: false,
  templateUrl: './device-modal.component.html',
  styleUrl: './device-modal.component.scss'
})
export class DeviceModalComponent {

  @Input() visible = false;
  @Input() device: any = null;
  @Output() close = new EventEmitter<void>();

  handleCancel() {
    this.close.emit();
  }
}
