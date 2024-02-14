import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';
import { PublicOAuthConfig } from './PublicOAuthConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private refreshToken!: string;

  constructor(private http: HttpClient) { }

  async getMemberfulAuthUrl(): Promise<string> {
    const state = this.generateRandomString(1, true);
    const codeVerifier = this.generateRandomString(32);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_code_verifier', codeVerifier);

    return `${PublicOAuthConfig.BASE_URL}/oauth?` +
      `response_type=code&` +
      `client_id=${PublicOAuthConfig.CLIENT_ID}&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=${PublicOAuthConfig.CODE_CHALLENGE_METHOD}&` +
      `redirect_uri=${encodeURIComponent(PublicOAuthConfig.REDIRECT_URI)}`;
  }

  processOAuthCallback(code: string, receivedState: string): Observable<any> {
    const storedState = sessionStorage.getItem('oauth_state');
    const storedCodeVerifier = sessionStorage.getItem('oauth_code_verifier');

    if (!storedState || !storedCodeVerifier || storedState !== receivedState) {
      // Clear stored values to prevent reuse
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('oauth_code_verifier');
      return throwError(() => new Error("State does not match"));
    }

    const payload = new HttpParams()
      .set('client_id', PublicOAuthConfig.CLIENT_ID)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('code_verifier', storedCodeVerifier);

    return this.http.post<any>(`${PublicOAuthConfig.BASE_URL}/oauth/token`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      catchError((error) => {
        return throwError(() => new Error("Failed to exchange code for tokens: " + error.message));
      }),
      tap((response) => {
        this.storeTokens(response.access_token, response.refresh_token);
      })
    );
  }

  // TODO: use an HTTP interceptor to catch responses that indicate an expired access token (typically a 401 Unauthorized response). 
  // Upon detecting such a response, the interceptor can pause further requests, refresh the token, and then retry the failed requests with the new token.
  refreshAccessToken(): Observable<any> {

    const payload = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', PublicOAuthConfig.CLIENT_ID)
      .set('refresh_token', this.refreshToken);

    return this.http.post<any>(`${PublicOAuthConfig.BASE_URL}/oauth/token`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      catchError((error) => {
        return throwError(() => new Error("Failed to refresh access token: " + error.message));
      }),
      tap((response) => {
        this.storeTokens(response.access_token, response.refresh_token);
      })
    );
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
  

  private storeTokens(accessToken: string, refreshToken: string): void {
    // Securely store the tokens for later use
    this.accessTokenSubject.next(accessToken);
    this.refreshToken = refreshToken;
    // Note: In a real application, consider storing tokens in a more secure place than a simple variable,
    // such as secure storage mechanisms provided by the framework or platform you're using.
  }

  // Utility method to access the currently stored access token
  get accessToken(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }
}