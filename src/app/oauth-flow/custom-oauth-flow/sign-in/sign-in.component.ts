import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  constructor(private authService: AuthService) { }

  // Start the authentication flow
  async initiateMemberfulSignIn(): Promise<void> {    

    const authUrl = await this.authService.getMemberfulAuthUrl();
    window.location.href = authUrl;
  }
}