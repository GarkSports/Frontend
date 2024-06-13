import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  errorMessage: string = '';

  constructor(
    private settings: CoreService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    // if (localStorage.getItem('jwtToken')) {
    //   this.authService.checkIfManager().subscribe((isManager) => {
    //     if (isManager) {
    //       // Navigate to manager page
    //       this.router.navigate(['/apps/profil']);
    //     } else {
    //       // Check if the user is an admin
    //       this.authService.checkIfAdmin().subscribe((isAdmin) => {
    //         if (isAdmin) {
    //           // Navigate to admin page
    //           this.router.navigate(['/dashboards/dashboard1']);
    //         } else {
    //           // Navigate to default page for regular users
    //           this.router.navigate(['/authentication/side-login']);
    //         }
    //       });
    //     }
    //   });
    // }
  }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (this.form.valid) {
      const formData = {
        email: this.form.value.uname,
        password: this.form.value.password,
      };

      this.http
        .post<any>(environment.apiUrl + 'auth/authenticate', formData, {
          withCredentials: true,
          headers,
        })
        .subscribe(
          (response) => {
            // Handle successful response
            console.log('Authentication successful', response);
            localStorage.setItem('jwtToken', response.accessToken);

            // Check if the user is a manager
            this.authService.checkIfManager().subscribe((isManager) => {
              if (isManager) {
                // Navigate to manager page
                this.router.navigate(['/apps/academieprofile']);
              } else {
                // Check if the user is an admin
                this.authService.checkIfAdmin().subscribe((isAdmin) => {
                  if (isAdmin) {
                    // Navigate to admin page
                    this.router.navigate(['/dashboards/dashboard1']);
                  } else {
                    // Navigate to default page for regular users
                    this.router.navigate(['/authentication/side-login']);
                  }
                });
              }
            });
          },
          (error) => {
          // Handle error
          console.error('Authentication error', error);

          // Check if the error is an InvalidEmailException
          if (error.error && error.error.message === 'Email not found') {
            this.errorMessage = `L'adresse e-mail n'est pas enregistrée. Veuillez réessayer.`;
            } else if (error.error && error.error.message === 'Invalid password') {
            this.errorMessage = 'Mot de passe incorrect. Veuillez réessayer.';
            } else if (error.error && error.error.message === 'User is blocked') {
            this.errorMessage = `Votre compte a été bloqué. Veuillez contacter l'administrateur.`;
            } else if (error.status === 400 || error.status === 401) {
            // Handle other authentication errors
            this.errorMessage = `Une erreur est survenue lors de l'authentification. Veuillez réessayer plus tard.`;
            } else {
            // Handle other errors
            this.errorMessage = `Une erreur est survenue lors de l'authentification. Veuillez réessayer plus tard.`;
            }
        }
      );
  }
}
}
