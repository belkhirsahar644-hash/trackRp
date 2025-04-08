import { Component, EventEmitter,Output, Input  } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeletevehiculeService } from '../../deletevehicule.service';
import { Device } from '../../vehicule.service';

@Component({
  selector: 'app-delete-vehicule',
  standalone: false,
  templateUrl: './delete-vehicule.component.html',
  styleUrl: './delete-vehicule.component.scss'
})
export class DeleteVehiculeComponent {
  @Output() deleteEvent = new EventEmitter<void>();
  @Input() device: Device={name: '',uniqueId: '', model: ''}

  constructor(private modal: NzModalService, private deletevehiculeService: DeletevehiculeService ) {}
  ngOnInit(): void {
    this.showDeleteConfirm();
  }
  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Êtes-vous sûr de supprimer ce véhicule ?',
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
    if (!this.device || !this.device.uniqueId) {
      console.error("Aucun véhicule sélectionné !");
      return;
    }
    this.deletevehiculeService.deleteVehicule(this.device).subscribe({
      next:(response) => {
        this.deleteEvent.emit();
      },
      error: (Error) => {
        console.error(Error);
      }
    })

  }


}
