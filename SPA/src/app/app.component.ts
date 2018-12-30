import { AuthService } from './_services/auth.service';
import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  show:boolean = false;
  signIn = false;
  helper = new JwtHelperService();

  constructor(public authService: AuthService, private router: Router) {
    this.persist();
    if (localStorage.getItem('cart')) {
      authService.cartNumber = JSON.parse(localStorage.getItem('cart')).length;
    }
  }

  persist () {
    const token = localStorage.getItem('token');
    this.authService.user = this.helper.decodeToken(token);
  }

  toggleCollapse() {
    this.show = !this.show
  }

  toggleSignIn() {
    this.signIn = !this.signIn;
  }

  logOut() {
    this.authService.user.user = {};
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}
