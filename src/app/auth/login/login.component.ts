import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { LoginDataModel } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router)
  loginObj: LoginDataModel = {
    email: '',
    password: ''
  }

  constructor() {}

  onLogin() {
    debugger;
    console.log(this.loginObj);
    if (this.authService.login()) {
      this.router.navigateByUrl('/dashboard');
    }
  }
}
