import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, model } from '@angular/core';
import { AddvehiculeService } from '../../services/addvehicule.service';
import { Device } from '../../services/vehicule.service';
import {FormGroup,FormControl,NonNullableFormBuilder,Validators} from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-vehicule',
  standalone: false,
  templateUrl: './add-vehicule.component.html',
  styleUrl: './add-vehicule.component.scss'
})
export class AddVehiculeComponent implements OnInit, OnDestroy {
  @Input() device: Device = {
    model: '',
    name: '',
    uniqueId: '',
    attributes:{
      nameDriver:'',
      speedLimit:'',
      fuelDropThreshold:'',
      fuelIncreaseThreshold:'',
    },
  };
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() addEvent = new EventEmitter<any>();
  @Input() isVisibleV = true;

  message: string= '';
  private destroy$ = new Subject<void>();
  VehiculForm: FormGroup;

  constructor (private addvehicule: AddvehiculeService, private fb: NonNullableFormBuilder){
    this.VehiculForm = this.fb.group({
      uniqueId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      nameDriver: new FormControl(''),
      speedLimit: new FormControl(''),
      fuelDropThreshold: new FormControl(''),
      fuelIncreaseThreshold: new FormControl(''),

    })
  }
  ngOnInit(): void {
    this.VehiculForm.patchValue({
      name: this.device?.name || '',
      uniqueId: this.device?.uniqueId || '',
      model: this.device?.model || '',
      nameDriver: this.device?.attributes?.nameDriver || '',
      speedLimit: this.device?.attributes?.speedLimit || '',
      fuelDropThreshold: this.device?.attributes?.fuelDropThreshold || '',
      fuelIncreaseThreshold: this.device?.attributes?.fuelIncreaseThreshold || '',

    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.addveh();

  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.cancelEvent.emit();
  }

  addveh(): void {
    console.log('ID du Véhicule:', this.device.id);

    const formData = this.VehiculForm.value;
    const driverData = {
      id: this.device.id,
      name: formData.name,
      uniqueId: formData.uniqueId,
      model: formData.model,
      attributes: {
        nameDriver: formData.nameDriver,
        speedLimit: formData.speedLimit,
        fuelDropThreshold:  formData.fuelDropThreshold,
        fuelIncreaseThreshold:  formData.fuelIncreaseThreshold,

      }
    };

      console.log('Device data to send:', driverData);
    this.addvehicule.addveh(driverData).subscribe({
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
