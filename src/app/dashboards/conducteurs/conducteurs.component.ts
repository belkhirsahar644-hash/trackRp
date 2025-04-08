import { Component  } from '@angular/core';
import { ConducteursService, Driver } from '../../services/conducteurs.service';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-conducteurs',
  templateUrl: './conducteurs.component.html',
  standalone: false,
  styleUrls: ['./conducteurs.component.scss']
})
export class ConducteursComponent  {

  selectedDriver: Driver =  {
    name: '',
    email: '',
    phone: '',
    password: '',
    driver: true,
  }
  driver: Driver[] = [];
  showForm: boolean = false;
  showdeleteModal: boolean = false;
  searchValue = '';
  visible = false;
  private unsubscribe$ = new Subject<void>();
  listOfDisplayData = [...this.driver];

  constructor(private conducteursService: ConducteursService, private modal: NzModalService, ) {}

  trackById(index: number, item: any): number {
    return item.id;
  }

  openDeleteModal(driver: Driver): void {
    this.selectedDriver = driver;
    this.showdeleteModal = true;
  }

  ngOnInit(): void {
    this.loadDriver();

  }
  editConducteur(driver: Driver){
    this.selectedDriver= {...driver};
    console.log("Conducteur sélectionné:", this.selectedDriver);
    this.showForm = true;
    console.log("Formulaire affiché:", this.showForm);

  }

/*deleteCon(){
  this.addconducteurService.deleteDriver().subscribe(

  )
}*/

  loadDriver(){
    this.conducteursService.getDriver().subscribe(
      {
        next: (value) => {
          this.driver = value;
          this.listOfDisplayData = [...this.driver];
        },
        error: (err) => {
          console.error('Erreur lors du chargement des conducteurs:', err);
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
    this.listOfDisplayData = this.driver.filter((item: Driver) => item.name.indexOf(this.searchValue) !== -1);
  }
  toggleForm(): void {
    this.selectedDriver ={
      name: '',
      email: '',
      phone: '',
      password: '',
      driver: true,
    }
  this.showForm = !this.showForm;
}
  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Déclenche l'arrêt des abonnements
    this.unsubscribe$.complete(); // Libère la mémoire
  }
}
