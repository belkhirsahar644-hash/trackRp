import {Component, OnInit} from '@angular/core';
import {LayoutService} from '../services/layout.service';
import {Session} from '../services/layout.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  isSiderOpen: boolean = false;
  menuVisible: boolean = false;
  userName: string ='';
  showLogout: boolean = false;
  isUserIconClicked: boolean = false;
  selectedPeriod: string = 'today';

  constructor(private layoutService : LayoutService , private router: Router) {}

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
