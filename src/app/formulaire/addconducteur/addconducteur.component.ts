/*import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, interval, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { DriverService } from '../../driver.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-addconducteur',
  standalone: false,
  templateUrl: './addconducteur.component.html',
  styleUrls: ['./addconducteur.component.scss']
})
export class AddconducteurComponent implements OnInit, OnDestroy {
  conducteurForm: FormGroup; // Formulaire pour ajouter un conducteur
  conducteurs: any[] = []; // Liste des conducteurs récupérés
  private subscription!: Subscription;
  private updateInterval = 5000; // Intervalle pour rafraîchir les données (5 secondes)
  private unsubscribe$ = new Subject<void>(); // Pour gérer l'annulation de la souscription

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private driverService: DriverService
  ) {
    // Initialisation du formulaire avec validation
    this.conducteurForm = this.fb.group({
      name: ['', Validators.required], // Champ obligatoire
      email: ['', [Validators.required, Validators.email]], // Email valide obligatoire
      phone: ['', Validators.required], // Champ obligatoire
      vehicleId: ['', Validators.required] // ID du véhicule obligatoire
    });
  }

  ngOnInit(): void {
    this.getConducteurs(); // Récupérer les conducteurs au chargement
    this.subscription = interval(this.updateInterval)
      .pipe(takeUntil(this.unsubscribe$)) // Arrête la souscription à l'intervalle si le composant est détruit
      .subscribe(() => this.getConducteurs());
  }

  ngOnDestroy(): void {
    // Annuler la souscription à l'intervalle quand le composant est détruit
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // Fonction pour récupérer les conducteurs et les associer aux véhicules
  getConducteurs(): void {
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('admin@poste.tn:rp2025'));

    const devicesRequest = this.http.get<any[]>('http://localhost:8082/api/devices', { headers })
      .pipe(catchError(error => {
        console.error('Erreur lors de la récupération des véhicules', error);
        return of([]); // Retourner un tableau vide en cas d'erreur
      }));

    const permissionsRequest = this.http.get<any[]>('http://localhost:8082/api/permissions', { headers })
      .pipe(catchError(error => {
        console.error('Erreur lors de la récupération des permissions', error);
        return of([]); // Retourner un tableau vide en cas d'erreur
      }));

    // Exécution des deux requêtes en parallèle
    forkJoin([devicesRequest, permissionsRequest])
      .pipe(takeUntil(this.unsubscribe$))  // Arrêter la souscription si le composant est détruit
      .subscribe(([devices, permissions]) => {
        console.log('Véhicules récupérés:', devices);
        console.log('Permissions récupérées:', permissions);

        // Associer chaque véhicule à un conducteur s'il existe
        this.conducteurs = devices.map(device => {
          const permission = permissions.find(p => p.deviceId === device.id);
          return {
            model: device.model,
            centre: device.groupId,
            matricule: device.uniqueId,
            statut: device.status,
            driverId: permission ? permission.driverId : null // Associer un conducteur
          };
        });
      });
  }

  // Fonction pour ajouter un conducteur via le formulaire
  onSubmit(): void {
    if (this.conducteurForm.valid) {
      const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('admin@poste.tn:rp2025'));

      // Requête POST pour ajouter un conducteur
      this.http.post('http://localhost:8082/api/drivers', this.conducteurForm.value, { headers })
        .pipe(catchError(error => {
          console.error('Erreur lors de l\'ajout du conducteur', error);
          return of(null); // Retourne null en cas d'erreur pour éviter de bloquer le processus
        }))
        .subscribe(
          (response: any) => {
            console.log('Conducteur ajouté avec succès', response);
            this.conducteurForm.reset(); // Réinitialiser le formulaire après succès
          },
          (error) => {
            console.error('Erreur lors de l\'ajout du conducteur', error);
          }
        );
    }
  }
}*/

import { Component } from '@angular/core';
import { DriverService } from '../../driver.service';

@Component({
  selector: 'app-addconducteur',
  standalone: false,
  templateUrl: './addconducteur.component.html',
  styleUrls: ['./addconducteur.component.scss']
})
export class AddconducteurComponent {
  driverName: string = '';
  uniqueId: string = '';
  message: string = '';

  constructor(private driverService: DriverService) {}

  addDriver() {
    if (!this.driverName || !this.uniqueId) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.driverService.addDriver(this.driverName, this.uniqueId).subscribe({
      next: (response) => {
        this.message = 'Conducteur ajouté avec succès !';
        
      },
      error: (error) => {
        this.message = 'Erreur lors de l\'ajout du conducteur.';
        console.error(error);
      }
    });
  }
}
