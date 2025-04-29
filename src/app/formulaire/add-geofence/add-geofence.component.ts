import { Component , inject , Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type Type = 'Zone identifié' | 'Zone autorisé';

@Component({
  selector: 'app-add-geofence',
  standalone: false,
  templateUrl: './add-geofence.component.html',
  styleUrl: './add-geofence.component.scss'
})
export class AddGeofenceComponent {
  private fb = inject(FormBuilder);

  @Input() FormVisible = false;
  @Input() selectedDevice: any;
  @Output() onSubmit = new EventEmitter<{ nom: string; type: Type }>();
  @Output() cancelForm = new EventEmitter<void>();


  validateForm = this.fb.group({
    nom: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<Type | null>(null, Validators.required)
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.onSubmit.emit(this.validateForm.value as { nom: string; type: Type });
      console.log('Ajouter', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  cancel(): void {
    this.cancelForm.emit();
  }


}
