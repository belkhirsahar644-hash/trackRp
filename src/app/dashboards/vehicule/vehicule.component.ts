import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { interval, Subscription, Subject } from 'rxjs';
import { Device, VehiculeService } from '../../vehicule.service';
import { takeUntil } from 'rxjs';
@Component({
  selector: 'app-vehicule',
  standalone: false,
  templateUrl: './vehicule.component.html',
  styleUrl: './vehicule.component.scss'
})
export class VehiculeComponent  {
  //@Input() → Indique que cette variable provient du composant parent.
  @Input() isSidebarOpen: boolean = false;
  selectedDevice: Device =  {
    model: '',
    name: '',
    uniqueId: ''
  };
  vehicules: Device[] = [];
  private subscription!: Subscription;
  private updateInterval = 5000;
  private unsubscribe$ = new Subject<void>();
  showForm: boolean = false;
  constructor( private vehiculeService :VehiculeService ){}
  ngOnInit(): void {
    this.loadDevices(); // 1️⃣ Charger les vehicules immédiatement


  }

  editVehicle(device: Device) {
    this.selectedDevice = {...device};
    this.showForm = true;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Déclenche l'arrêt des abonnements
    this.unsubscribe$.complete(); // Libère la mémoire

  }

  loadDevices() {
    this.vehiculeService.getDevices().subscribe(
      {
        next: (value) => {
          this.vehicules = value;
        }
      }
    )
  }



   loadConducteurs(): void {
    this.showForm = false;
    this.vehiculeService.getVehicule().subscribe(([devices, permissions]) => {
     // this.vehicules = this.vehiculeService.associer(devices, permissions);
      console.log('✅ Conducteurs mis à jour:', this.vehicules);
    });



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
}
