import { AddconducteurService} from '../../addconducteur.service';
import { Driver } from '../../conducteurs.service';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormGroup,FormControl,NonNullableFormBuilder,Validators} from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-addconducteur',
  standalone: false,
  templateUrl: './addconducteur.component.html',
  styleUrls: ['./addconducteur.component.scss']
})
export class AddconducteurComponent implements OnInit, OnDestroy {
  @Input() driver: Driver={ name: '', email: '', phone: '', password: '', driver: true}
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() addEvent = new EventEmitter<any>();
  @Input() isVisibleC = true;

  message: string= '';
  private destroy$ = new Subject<void>();
  conducteurForm: FormGroup;

  constructor( private addconducteurService: AddconducteurService, private fb: NonNullableFormBuilder) {
    this.conducteurForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }
  ngOnInit(): void {
    this.conducteurForm.patchValue({
      name: this.driver?.name || '',
      email: this.driver?.email || '',
      phone: this.driver?.phone || '',
      password: this.driver?.password || ''
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.addCon();

  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.cancelEvent.emit();
  }



        addCon(): void {
          console.log('ID du conducteur:', this.driver.id);

          const formData = this.conducteurForm.value;
          const driverData = {
            id: this.driver.id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            driver: true as true
          };

          console.log('Driver data to send:', driverData);

          this.addconducteurService.addConducteur(driverData).subscribe({
            next: () => {
              this.addEvent.emit();
              this.message = 'Conducteur ajouté avec succès!';
            },
            error: (error) => {
              this.message = 'Erreur lors de l\'ajout du conducteur.';
              console.error(error);
            }
          });
        }

  autoTips: Record<string, Record<string, string>> = {

    en: {
      required: 'Input is required'
    },
    default: {
      email: '邮箱格式不正确/The input is not valid email'
    }
  };



  submitForm(): void {
    if (this.conducteurForm.valid) {
      console.log('submit', this.conducteurForm.value);
    } else {
      Object.values(this.conducteurForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  /*nameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({
            duplicated: {  en: `The username is redundant!` }
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  }
}*/

/*export type MyErrorsOptions = { en: string } & Record<string, NzSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': `最小长度为 ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { 'zh-cn': `最大长度为 ${maxLength}`, en: `MaxLength is ${maxLength}` } };
    };
  }

  static mobile(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;

    if (isEmptyInputValue(value)) {
      return null;
    }

    return isMobile(value)
      ? null
      : { mobile: { en: `Mobile phone number is not valid` } };
  }
}

function isEmptyInputValue(value: NzSafeAny): boolean {
  return value == null || value.length === 0;
}*/

/*function isMobile(value: string): boolean {
  return typeof value === 'string' && /(^1\d{7}$)/.test(value);
}*/


}
