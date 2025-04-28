import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Device, VehiculeService} from '../../services/vehicule.service';

@Component({
  selector: 'app-vehicule',
  standalone: false,
  templateUrl: './vehicule.component.html',
  styleUrl: './vehicule.component.scss'
})
export class VehiculeComponent implements OnInit, OnDestroy{

  selectedDevice: Device = {
    model: '',
    name: '',
    uniqueId: '',
    attributes:{nameDriver:''},
  }
  device: Device[] = [];
  showForm: boolean = false;
  searchValue = '';
  visible = false;
  private unsubscribe$ = new Subject<void>();
  listOfDisplayData = [...this.device];

  constructor(
    private vehiculeService: VehiculeService,
  ) {}


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
      uniqueId: '',
      attributes:{nameDriver:''},


    };
    this.showForm = !this.showForm;
  }




  deleteVehicle(data: Device) {
    this.vehiculeService.deleteVehicule(data).subscribe(
      {
        next: (value) => {
          this.loadVehicule()
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Déclenche l'arrêt des abonnements
    this.unsubscribe$.complete(); // Libère la mémoire

  }
}
