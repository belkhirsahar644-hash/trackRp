import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from '../services/login.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) {}
  email: string= '';
  password: string= '';
  errorMessage: string= '';


    onLogin() {
      console.log('Tentative de connexion avec:', this.email, this.password);
      this.loginService.login(this.email, this.password).subscribe({
        next: (value) => {
          console.log('Réponse serveur:', value);
          alert('Connexion réussie');
          console.log('Redirection en cours...');
          this.router.navigate(['/home']).then(success => {
            console.log('Navigation réussie ?', success);
            if (!success) {
              console.error('La navigation vers /home a échoué !');
            }
          }).catch(err => {
            console.error('Erreur de navigation:', err);
          });
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.errorMessage = 'Échec de la connexion';
          alert('Erreur de connexion');
        },
      });
    }



}

