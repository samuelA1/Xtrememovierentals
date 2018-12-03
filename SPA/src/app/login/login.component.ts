import { AlertifyService } from './../_services/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertify: AlertifyService) { }

  ngOnInit() {
    this.createLogin();
  }

createLogin() {
  this.loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })
}

  async login() {
    this.user = Object.assign({}, {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    });
    try {
      var user = await this.authService.login(this.user);
      if (user['success']) {
        localStorage.setItem('token', user['token']);
        this.router.navigate(['/home']);
        this.alertify.success(user['message']);   
      } else {
        
      }
    } catch (error) {
      this.alertify.error( 'Login unsuccessful');
    }

  }

}
