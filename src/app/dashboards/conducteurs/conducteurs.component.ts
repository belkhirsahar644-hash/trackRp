
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConducteursService } from '../../conducteurs.service';
import { Input } from '@angular/core';
@Component({
  selector: 'app-conducteurs',
  templateUrl: './conducteurs.component.html',
  standalone: false,
  styleUrls: ['./conducteurs.component.scss']
})
export class ConducteursComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen: boolean = false;  

  conducteurs: any[] = [];
  private subscription!: Subscription;
  private updateInterval = 5000;
  private unsubscribe$ = new Subject<void>();
  showForm: boolean = false;

  constructor(private conducteursService: ConducteursService) {}

  ngOnInit(): void {
    this.loadConducteurs();
    this.subscription = interval(this.updateInterval)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.loadConducteurs());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadConducteurs(): void {
    this.conducteursService.getConducteurs().subscribe(([devices, permissions]) => {
      this.conducteurs = this.conducteursService.mapConducteurs(devices, permissions);
      console.log('✅ Conducteurs mis à jour:', this.conducteurs);
    });
  }
// Fonction pour afficher ou cacher le formulaire

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

}
