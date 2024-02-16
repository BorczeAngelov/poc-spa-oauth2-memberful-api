import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
    selector: 'app-oauth-callback',
    template: `<p>Processing login... (angular-oauth2-oidc lib)</p>`,
})
export class OAuthCallbackComponent implements OnInit {
    constructor(private oauthService: OAuthService, private router: Router) { }

    ngOnInit() {
        console.log('OAuthCallbackComponent: Starting login process...');
        this.oauthService.tryLogin().then(success => {
            if (this.oauthService.hasValidAccessToken()) {
                console.log('OAuthCallbackComponent: Login successful, valid access token obtained.');
                // Redirect to a different page if the user is logged in
                this.router.navigateByUrl('/home'); // Adjust this to your application's needs
            } else {
                console.log('OAuthCallbackComponent: Login process completed, but no valid access token was obtained.');
                // Handle login failure or redirect back to login page
                // this.router.navigateByUrl('/login'); // Adjust this according to your routing setup
            }
        }).catch(err => {
            console.error('OAuthCallbackComponent: Error during login process', err);
            // Optionally redirect to an error page or back to login
            // this.router.navigateByUrl('/login'); // Use a more appropriate route if you have an error page
        });
    }
}
