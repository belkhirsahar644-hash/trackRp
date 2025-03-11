import { Component, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { AddvehiculeService } from '../../addvehicule.service';
import { Device } from '../../vehicule.service';

@Component({
  selector: 'app-add-vehicule',
  standalone: false,
  templateUrl: './add-vehicule.component.html',
  styleUrl: './add-vehicule.component.scss'
})
export class AddVehiculeComponent {
  @Output() addEvent = new EventEmitter<any>();

  message: string= '';

  @Input() device: Device = {
    model: '',
    name: '',
    uniqueId: ''
  };

  constructor (private addvehicule: AddvehiculeService){}
  addveh() {
    this.addvehicule.addveh(this.device).subscribe({
      next: (response) => {
        this.addEvent.emit();
        this.message = 'Véhicule ajouté avec succès !';

      },
      error: (error) => {
        this.message = 'Erreur lors de l\'ajout du véhucule.';
        console.error(error);
      }
    });
  }
}
