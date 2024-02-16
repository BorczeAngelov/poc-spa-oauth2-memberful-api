import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig, OAuthErrorEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private oauthService: OAuthService, private authConfig: AuthConfig) {
    this.oauthService.configure(authConfig);

    // Maybe this will be needed on refresh...?
    // this.oauthService.tryLogin()
    //   .then(this.handleNewToken)
    //   .catch(err => { console.error('AuthService: Error during login process.', err); });


    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent', event);
      }
    });
  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public logOut() {
    this.oauthService.logOut();
  }

  public get accessToken(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }

  private handleNewToken(): void {
    if (this.oauthService.hasValidAccessToken()) {
      const accessToken = this.oauthService.getAccessToken();
      this.accessTokenSubject.next(accessToken);
    }
  }

  // Add other methods as needed, leveraging OAuthService for tasks such as token refresh
  // Note: there might be out-of-the-box solutions for token refresh from angular-oauth2-oidc lib
}
