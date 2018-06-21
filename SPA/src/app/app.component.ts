import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  show:boolean = false;
  signIn = false;

  toggleCollapse() {
    this.show = !this.show
  }

  toggleSignIn() {
    this.signIn = !this.signIn;
  }
}
