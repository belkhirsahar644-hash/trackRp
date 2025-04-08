import { Component, EventEmitter,Output, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteConducteurService } from '../../delete-conducteur.service';
import { Driver } from '../../conducteurs.service';

@Component({
  selector: 'app-delete-conducteur',
  standalone: false,
  templateUrl: './delete-conducteur.component.html',
  styleUrl: './delete-conducteur.component.scss'
})
export class DeleteConducteurComponent {
  @Output() deleteEvent = new EventEmitter<void>();
  @Input() driver: Driver={name: '',email: '', phone: '',password: '',driver: true, }

  constructor(private modal: NzModalService, private deleteConducteurService: DeleteConducteurService ) {}
  ngOnInit(): void {
    this.showDeleteConfirm();
  }


  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Êtes-vous sûr de supprimer ce conducteur ?',
      nzOkText: 'Oui',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {this.deletecon();
        console.log('OK')},
      nzCancelText: 'Non',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  deletecon(): void{
    if (!this.driver || !this.driver.email) {
      console.error("Aucun conducteur sélectionné !");
      return;
    }
    this.deleteConducteurService.deleteDriver(this.driver).subscribe({
      next:(response) => {
        this.deleteEvent.emit();
      },
      error: (Error) => {
        console.error(Error);
      }
    })

  }
  }



