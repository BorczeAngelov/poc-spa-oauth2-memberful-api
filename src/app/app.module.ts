import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
// Import other components here

const appRoutes: Routes = [
    { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
    {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SignInComponent)
    },
    // Define other routes here
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
