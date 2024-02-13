import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  // Properties to hold the user-input values for secrets
  // These properties are placeholders for the actual secrets, 
  // which should be securely managed using a secret management system
  clientIdHelper: string = ''; // Placeholder for the OAuth client ID
  redirectUriHelper: string = ''; // Placeholder for the OAuth redirect URI

  // start the flow
  async signInWithMemberful(): Promise<void> {
    const state = this.generateStateCode();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    
    const clientId = this.clientIdHelper;
    const redirectUri = encodeURIComponent(this.redirectUriHelper);

    const authUrl = `https://innovaspeak.memberful.com/oauth?response_type=code&client_id=${clientId}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${redirectUri}`;

    window.location.href = authUrl;
  }

  //TODOs: Use npm i angular-oauth2-oidc, to follow best practices
  
  // Examples for generating PKCE and state values
  private generateStateCode(): string {
    return Array.from(window.crypto.getRandomValues(new Uint32Array(1)), dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  private generateCodeVerifier(): string {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(32)), dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}