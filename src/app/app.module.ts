import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OauthCallbackComponent } from './oauth-flow/custom-oauth-flow/oauth-callback/oauth-callback.component';
import { SignInComponent } from './oauth-flow/custom-oauth-flow/sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OAuthModule, AuthConfig, OAuthStorage } from 'angular-oauth2-oidc';
import { publicAuthConfig } from './oauth-flow/angular-oauth2-oidc-library/PublicAuthConfig';
import { LoginComponent } from './oauth-flow/angular-oauth2-oidc-library/login-component';
import { OAuthCallbackComponent } from './oauth-flow/angular-oauth2-oidc-library/oauth-callback-component';
import { HomeComponent } from './home/home.component';


const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'oauth-callback', component: OAuthCallbackComponent },
    // { path: 'sign-in', component: SignInComponent }, // obsolete-custom implementation
    // { path: 'oauth-callback', component: OauthCallbackComponent }, // obsolete-custom implementation
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        FormsModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: [publicAuthConfig.issuer!],
                sendAccessToken: true,
            },
        }),
    ],
    providers: [
        { provide: AuthConfig, useValue: publicAuthConfig }, // dependency injections
        { provide: OAuthStorage, useValue: localStorage }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
