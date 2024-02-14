import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../oauth-callback/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  constructor(private authService: AuthService) { }

  // Properties to hold the user-input values for secrets
  // These properties are placeholders for the actual secrets, 
  // which should be securely managed using a secret management system
  clientIdHelper: string = ''; // Placeholder for the OAuth client ID
  redirectUriHelper: string = ''; // Placeholder for the OAuth redirect URI

  // Start the authentication flow
  async initiateMemberfulSignIn(): Promise<void> {
    const clientId = this.clientIdHelper;
    const redirectUri = encodeURIComponent(this.redirectUriHelper);
    
    const authUrl = await this.authService.getMemberfulAuthUrl(clientId, redirectUri);

    window.location.href = authUrl;
  }
}