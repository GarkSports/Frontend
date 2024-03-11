import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();
  

  constructor(private settings: CoreService, private router: Router, private http: HttpClient) { }

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
        username: this.form.value.uname,
        password: this.form.value.password
      };

      
      
      this.http.post<any>('http://localhost:8089/auth/authenticate', formData, { headers })
      console.log(this.form.value);
          // Handle successful response, e.g., redirect to dashboard
      this.router.navigate(['/dashboards/dashboard1']);
        
    }
  }

}
