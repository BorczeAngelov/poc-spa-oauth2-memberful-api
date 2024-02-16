import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OauthCallbackComponent } from './oauth-flow/custom-oauth-flow/oauth-callback/oauth-callback.component';
import { SignInComponent } from './oauth-flow/custom-oauth-flow/sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: SignInComponent },
    { path: 'oauth-callback', component: OauthCallbackComponent },
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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
