import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div>
      <button (click)="login()">Login with Memberful (angular-oauth2-oidc lib)</button>
    </div>
  `,
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login();
  }
}
