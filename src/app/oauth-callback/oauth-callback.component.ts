import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css'
})
export class OauthCallbackComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const code = params['code']; // The authorization code
      const state = params['state']; // The state to verify
      
      if (code && state) {
        // Proceed with the exchange for tokens
        this.authService.exchangeCodeForTokens(code, state).subscribe({
          next: (tokens: any) => {
            console.log('OAuth flow completed, tokens received', tokens);
            // Handle successful token reception (e.g., navigate to a protected route)
          },
          error: (error: any) => {
            console.error('Error during token exchange', error);
            // Handle errors (e.g., show an error message)
          }
        });
      } else {
        console.error('Authorization code or state missing');
        // Handle missing code/state (e.g., navigate back to login)
      }
    });
  }
}