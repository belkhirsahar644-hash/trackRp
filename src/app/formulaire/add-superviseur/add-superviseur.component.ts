import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { AddsupervieurService } from '../../services/addsupervieur.service';
import { Superviseur } from '../../services/superviseur.service';

@Component({
  standalone: false,
  selector: 'app-add-superviseur',
  templateUrl: './add-superviseur.component.html',
  styleUrls: ['./add-superviseur.component.scss']
})
export class AddSuperviseurComponent implements OnInit, OnDestroy {
  @Input() superviseur: Superviseur = { name: '', email: '', phone: '', password: '', supervisor: true };
  @Output() addEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Input() isVisibleS = true;
  message = '';
  private destroy$ = new Subject<void>();
  superviseurForm: FormGroup;

  constructor(private addsupervieurService: AddsupervieurService, private fb: NonNullableFormBuilder) {
    this.superviseurForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
     // confirm: new FormControl('')
    });
  }



  ngOnInit(): void{
    this.superviseurForm.patchValue({
      name: this.superviseur?.name || '',
      email: this.superviseur?.email || '',
      phone: this.superviseur?.phone || '',
      password: this.superviseur?.password || '',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }




  handleOk(): void {
    console.log('Button ok clicked!');
    this.addSuperviseur();
    /*this.submitForm();
    if (this.superviseurForm.valid) {
      this.isVisible = false;
      this.addSuperviseur();
    }*/
  }

  handleCancel(): void {

    this.cancelEvent.emit();
    //this.isVisible = false;
    console.log('Button cancel clicked!');
  }
  addSuperviseur(): void {
    console.log('ID du conducteur:', this.superviseur.id);

          const formData = this.superviseurForm.value;
          const SuperviseurrData = {
            id: this.superviseur.id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            supervisor: true as true
          };
    //this.superviseur = this.superviseurForm.value;

    console.log('Superviseur data to send:', SuperviseurrData);

    this.addsupervieurService.addSuperviseur(SuperviseurrData).subscribe({
      next: () => {
        this.addEvent.emit();
        this.message = 'Superviseur ajouté avec succès!';
      },
      error: (error) => {
        this.message = 'Erreur lors de l\'ajout du superviseur.';
        console.error(error);
      }
    });
  }
  submitForm(): void {
    if (this.superviseurForm.valid) {
      console.log('Formulaire soumis:', this.superviseurForm.value);
    } else {
      Object.values(this.superviseurForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
