import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static BASE_URL = "https://innovaspeak.memberful.com";
  private static CODE_CHALLENGE_METHOD = "S256";

  private clientId!: string;
  private redirectUri!: string;

  private codeVerifier!: string;
  private state!: string;
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private refreshToken!: string;

  constructor(private http: HttpClient) {}

  // TODO: secret management instead
  initialize(clientId: string, redirectUri: string): void {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  }

  async getMemberfulAuthUrl(): Promise<string> {
    this.state = this.generateRandomString(1, true); // For state, use a single 32-bit integer
    this.codeVerifier = this.generateRandomString(32); // For code verifier, use 32 bytes
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
    
    return `${AuthService.BASE_URL}/oauth?` +
       `response_type=code&` +
       `client_id=${this.clientId}&` +
       `state=${this.state}&` +
       `code_challenge=${codeChallenge}&` +
       `code_challenge_method=${AuthService.CODE_CHALLENGE_METHOD}&` +
       `redirect_uri=${encodeURIComponent(this.redirectUri)}`;
  }
  
  processOAuthCallback(code: string, receivedState: string): Observable<any> {
    if (this.state !== receivedState) { //TODO: see if ng provides a better mechanisam for storing secret value between sessions
      return throwError(() => new Error("State does not match"));
    }

    const payload = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('code_verifier', this.codeVerifier);

    return this.http.post<any>(`${AuthService.BASE_URL}/oauth/token`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      catchError((error) => {
        return throwError(() => new Error("Failed to exchange code for tokens: " + error.message));
      }),
      tap((response) => {
        /*
        In response, Memberful will return an access token and a few other data points. Here's an example response:
  
        {
          "access_token": "abc",
          "token_type": "bearer",
          "expires_in": 900,
          "refresh_token": "zdf"
        }
        */

        this.storeTokens(response.access_token, response.refresh_token);
      })
    );
  }

  // TODO: use an HTTP interceptor to catch responses that indicate an expired access token (typically a 401 Unauthorized response). 
  // Upon detecting such a response, the interceptor can pause further requests, refresh the token, and then retry the failed requests with the new token.
  refreshAccessToken(): Observable<any> {
    const payload = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', this.clientId)
      .set('refresh_token', this.refreshToken);

    return this.http.post<any>(`${AuthService.BASE_URL}/oauth/token`, payload, {
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

  private storeTokens(accessToken: string, refreshToken: string): void {
    // Securely store the tokens for later use
    this.accessTokenSubject.next(accessToken);
    this.refreshToken = refreshToken;
    // Note: In a real application, consider storing tokens in a more secure place than a simple variable,
    // such as secure storage mechanisms provided by the framework or platform you're using.
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
  
  // Utility method to access the currently stored access token
  get accessToken(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }
}