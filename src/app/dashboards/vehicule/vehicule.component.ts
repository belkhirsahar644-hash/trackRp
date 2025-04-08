import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Device, VehiculeService } from '../../services/vehicule.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-vehicule',
  standalone: false,
  templateUrl: './vehicule.component.html',
  styleUrl: './vehicule.component.scss'
})
export class VehiculeComponent  {

  selectedDevice: Device =  {
    model: '',
    name: '',
    uniqueId: ''
  }
  device: Device[] = [];
  showForm: boolean = false;
  showdeleteModalV: boolean = false;
  searchValue = '';
  visible = false;
  private unsubscribe$ = new Subject<void>();
  listOfDisplayData = [...this.device];

  constructor( private vehiculeService :VehiculeService, private modal: NzModalService ){}
  openDeleteModalV(device: Device): void {
    this.selectedDevice = device;
    this.showdeleteModalV = true;
  }

  ngOnInit(): void {
    this.loadVehicule();

  }

  editVehicle(device: Device) {
    this.selectedDevice = {...device};
    console.log("Véhicule sélectionné:", this.selectedDevice);
    this.showForm = true;
    console.log("Formulaire affiché:", this.showForm);

  }
  loadVehicule() {
    this.vehiculeService.getVehicule().subscribe(
      {
        next: (value) => {
          this.device = value;
          this.listOfDisplayData = [...this.device];
        },
        error: (err) => {
          console.error('Erreur lors du chargement des véhicules:', err);
        }
      }
    )
  }
  reset(): void {
    this.searchValue = '';
    this.search();
  }
  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.device.filter((item: Device) => item.uniqueId.indexOf(this.searchValue) !== -1);
  }
  // Fonction pour afficher ou cacher le formulaire

toggleForm(): void {
  this.selectedDevice = {
    model: '',
    name: '',
    uniqueId: ''
  };
  this.showForm = !this.showForm;
}

  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Déclenche l'arrêt des abonnements
    this.unsubscribe$.complete(); // Libère la mémoire

  }


}
