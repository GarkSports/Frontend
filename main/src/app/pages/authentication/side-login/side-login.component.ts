import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Axios } from 'axios';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  

  constructor(private settings: CoreService, private router: Router, private authService: AuthService) { }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      const uname = this.form.value.uname as string;
      const password = this.form.value.password as string;
  
      if (uname && password) {
        this.authService.authenticate(uname, password);
            console.log('Authentication successful:');
            this.router.navigate(['/dashboards/dashboard1']);
          }

        
      } else {
        console.error('Username or password is undefined.');
      }
    }
  }
  

