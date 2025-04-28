import {Component, OnDestroy, OnInit} from '@angular/core';
import {Notification} from '../../services/notification.service';
import {NotificationService} from '../../services/notification.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {

  selectedNotification: Notification ={
    description: '',
    type: '',
  }

  notif: Notification[]=[];
  listOfDisplayData = [...this.notif];
  searchType = '';
  showForm: boolean = false;
  visibleSearch = false;
  private unsubscribe$ = new Subject<void>();


  constructor(
    private notificationService : NotificationService
  ) {}
  ngOnInit(): void {
    this.loadNotif();
  }

  loadNotif() {
    this.notificationService.getNotif().subscribe(
      {
        next:(value)=> {
          this.notif = value;
          this.listOfDisplayData = [...this.notif];
        },
        error:(error)=> {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      }
    )
  }
  reset(): void {
    this.searchType = '';
    this.search();
  }

  search(): void {
    this.visibleSearch = false;
    this.listOfDisplayData = this.notif.filter((item: Notification) => item.type.indexOf(this.searchType) !== -1);
  }

  // Fonction pour afficher ou cacher le formulaire

  toggleForm(): void {
    this.selectedNotification = {
      description: '',
      type: '',    };
    this.showForm = !this.showForm;
  }

  deleteNotification(data: Notification) {
    this.notificationService.deleteNotif(data).subscribe(
      {
        next:(value)=> {
          this.loadNotif()
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(); // Déclenche l'arrêt des abonnements
    this.unsubscribe$.complete(); // Libère la mémoire

  }


}

