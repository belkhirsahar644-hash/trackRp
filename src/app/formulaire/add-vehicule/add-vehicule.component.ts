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
    name: '',
    uniqueId: '',
    attributes:{
      region:'' ,
      nameDriver:'',
      carNumber:'' ,
      speedLimit:'',
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
      carNumber: new FormControl(''),
      nameDriver: new FormControl(''),
      speedLimit: new FormControl(''),
      region: new FormControl('', [Validators.required]),

    })
  }
  ngOnInit(): void {
    this.VehiculForm.patchValue({
      uniqueId: this.device?.uniqueId || '',
      name: this.device?.name || '',
      nameDriver: this.device?.attributes?.nameDriver || '',
      carNumber: this.device?.attributes?.carNumber || '',
      speedLimit: this.device?.attributes?.speedLimit || '',
      region: this.device?.attributes?.region || '',
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
      uniqueId: formData.uniqueId,
      name: formData.name,
      attributes: {
        nameDriver: formData.nameDriver,
        carNumber:formData.carNumber,
        speedLimit: formData.speedLimit,
        region: formData.region,

      }
    };

      console.log('Device data to send:', driverData);
    this.addvehicule.addveh(driverData).subscribe({
      next: () => {
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
