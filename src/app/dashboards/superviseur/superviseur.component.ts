import { Component } from '@angular/core';
import { Superviseur, SuperviseurService } from '../../superviseur.service';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-superviseur',
  standalone: false,
  templateUrl: './superviseur.component.html',
  styleUrl: './superviseur.component.scss'
})
export class SuperviseurComponent {
  selectedSup: Superviseur  = {
    name: '',
    email: '',
    phone: '',
    password: '',
    supervisor: true
  }
  superviseurs: Superviseur[] = [];
  isVisible=false;
  private unsubscribe$ = new Subject<void>();
  showForm: boolean = false;
  searchValue = '';
  visible = false;
  listOfData = [...this.superviseurs];
  showdeleteModalS:  boolean = false;

  constructor(private superviseurService: SuperviseurService, private modal: NzModalService){}

  openDeleteModalS(superviseurs: Superviseur){
    this.selectedSup = superviseurs;
    this.showdeleteModalS = true;

  }
  ngOnInit(): void {
    this.loadSuperviseur();
  }

  editSup(superviseurs: Superviseur) {
    this.selectedSup = {...superviseurs};
    console.log("Conducteur sélectionné:", this.selectedSup);
    this.showForm = true;
    console.log("Formulaire affiché:", this.showForm);

  }
  loadSuperviseur(){
    this.superviseurService.getSuperviseur().subscribe(
      {
        next: (value) => {
          this.superviseurs = value;
          this.listOfData = [...this.superviseurs];
        },
        error: (err) => {
          console.error('Erreur lors du chargement des superviseurs:', err);
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
    this.superviseurs = this.superviseurs.filter((item: Superviseur) => item.name.indexOf(this.searchValue) !== -1);
  }

toggleForm(): void {
  this.selectedSup ={
    id:0,
    name: '',
    email: '',
    phone: '',
    password: '',
    supervisor: true
  }
  this.showForm = !this.showForm;
}
  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Déclenche l'arrêt des abonnements
    this.unsubscribe$.complete(); // Libère la mémoire

  }
}
