import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private codeVerifier!: string;
  private state!: string;

  private static BASE_URL = "https://innovaspeak.memberful.com";
  private static CODE_CHALLENGE_METHOD = "S256";

  async getMemberfulAuthUrl(clientId: string, redirectUri: string): Promise<string> {
    this.state = this.generateRandomString(1, true); // For state, use a single 32-bit integer
    this.codeVerifier = this.generateRandomString(32); // For code verifier, use 32 bytes
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
    
    return `${AuthService.BASE_URL}/oauth?response_type=code&client_id=${clientId}&state=${this.state}&code_challenge=${codeChallenge}&code_challenge_method=${AuthService.CODE_CHALLENGE_METHOD}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  }

  private generateRandomString(byteLength: number, isUint32: boolean = false): string {
    const array = isUint32 ? new Uint32Array(byteLength) : new Uint8Array(byteLength);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Dummy implementation
  exchangeCodeForTokens(code: string, state: string): Observable<any> {
    console.log(`Exchanging code: ${code} with state: ${state} for tokens.`);
    // In a real application, you would make an HTTP request to your backend server here
    // For demonstration, we're just returning an Observable of a dummy token object
    return of({
      accessToken: 'dummy_access_token',
      refreshToken: 'dummy_refresh_token',
      expiresIn: 3600
    });
  }
}
