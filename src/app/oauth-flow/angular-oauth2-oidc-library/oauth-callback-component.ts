import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth-callback',
  template: `<p>Processing login... (angular-oauth2-oidc lib)</p>`,
})
export class OAuthCallbackComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) {}

  ngOnInit() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(_ => {
      if (this.oauthService.hasValidAccessToken()) {
        // Redirect to a different page if the user is logged in
        this.router.navigateByUrl('/home'); // Adjust this to your application's needs
      } else {
        // Handle login failure or redirect back to login page
        this.router.navigateByUrl('/login'); // Adjust this according to your routing setup
      }
    });
  }
}
