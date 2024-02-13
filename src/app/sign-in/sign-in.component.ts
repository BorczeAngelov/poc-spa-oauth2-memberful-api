import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  signInWithMemberful(): void {
    // Placeholder for actual Memberful authorization URL
    window.location.href = 'https://innovaspeak.memberful.com/';
  }

}
