import {Component, OnInit} from '@angular/core';
import {LayoutService} from '../services/layout.service';
import {Session} from '../services/layout.service';
import {Router} from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  isSiderOpen: boolean = false;
  menuVisible: boolean = false;
  userName: string = '';
  showLogout: boolean = false;
  isUserIconClicked: boolean = false;
  selectedPeriod: string = 'today';

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private layoutService: LayoutService, private router: Router) {
  }

  ngOnInit() {
    this.layoutService.getSession().subscribe(
      (session: Session | any) => {
        this.userName = session.name;
      },
      (error) => {

        console.log(error)
        this.router.navigate(['/login'])
      }
    )
  }
  // Méthode à appeler quand l'utilisateur change la periode
  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    //ne rien envoyé au layoutservise si period = custom
    if (period !== 'custom') {
      this.startDate = null;
      this.endDate = null;
      this.layoutService.setPeriod(period);
    }
  }

  // Méthode à appeler quand l'utilisateur change la date
  onCustomDateSelected(): void {
    if (this.startDate && this.endDate) {
      const start = dayjs(this.startDate).startOf('day').toISOString(); // 00:00:00
      const end = dayjs(this.endDate).endOf('day').toISOString();       // 23:59:59

      this.layoutService.setCustomPeriod({ from: start, to: end });
    }
  }


  handleSidebarToggle(isOpen: boolean) {
    this.isSiderOpen = isOpen;
  }
  toggleLogout() {
    this.showLogout = !this.showLogout;
  }

  logout() {

      this.router.navigate(['/login']);

  }
  handleUserIconClick() {
    this.isUserIconClicked = !this.isUserIconClicked;
    this.showLogout = this.isUserIconClicked;
  }

  isMapRoute(): boolean {
    return this.router.url.includes('/map');
  }


}
