import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Superviseur } from '../../superviseur.service';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DeleteSuperviseurService } from '../../delete-superviseur.service';
@Component({
  selector: 'app-delete-superviseur',
  standalone: false,
  templateUrl: './delete-superviseur.component.html',
  styleUrl: './delete-superviseur.component.scss'
})
export class DeleteSuperviseurComponent {
  @Output()deleteSEvent= new EventEmitter<void>();
  @Input()superviseurs: Superviseur  = {
    name: '',
    email: '',
    phone: '',
    password: '',
    supervisor: true
  }
  constructor(private modal: NzModalService, private deleteSuperviseurService: DeleteSuperviseurService ){}
  ngOnInit(): void {
    this.showDeleteConfirmS();
  }

  showDeleteConfirmS(): void {
    console.log('Affichage du modal de suppression');
    this.modal.confirm({
      nzTitle: 'Êtes-vous sûr de supprimer ce superviseur ?',
      //nzContent: 'Some descriptions</b>',
      nzOkText: 'Oui',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {this.deletesup();
        console.log('OK')},
      nzCancelText: 'Non',
      nzOnCancel: () => console.log('Cancel')
    });

  }
  deletesup(): void{
    if (!this.superviseurs || !this.superviseurs.id) {
      console.error("Aucun conducteur sélectionné !");
      return;
    }
    this.deleteSuperviseurService.deleteSup(this.superviseurs).subscribe({
      next:(response) => {
        this.deleteSEvent.emit();
      },
      error: (Error) => {
        console.error(Error);
      }
    })

  }


}
