import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

type Type = 'Zone identifié' | 'Zone autorisé';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  private fb = inject(FormBuilder);

  validateForm = this.fb.group({
    nom: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<Type | null>(null, Validators.required)
  });

  submitForm(): void {
    if (this.validateForm.valid) {
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
}
