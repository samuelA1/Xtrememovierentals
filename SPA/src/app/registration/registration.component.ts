import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, NgForm, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  user: any = {}


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private alertify: AlertifyService) { }  

  ngOnInit() {
    this.createRegistration();
  }

  confirmPassword(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }
  
  createRegistration() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      isSeller: ['']
    }, {validator: this.confirmPassword})

  }

  async register() {
    this.user = Object.assign({}, {
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value,
      isSeller: this.registerForm.get('isSeller').value
    });
    try {
      var user = await this.authService.register(this.user);
      if (user['success']) {
        localStorage.setItem('token', user['token']);
        this.router.navigate(['/home']);
        this.alertify.success(user['message']);   
      } else {
        
      }
    } catch (error) {
      this.alertify.error(error.message || user['message']);
    }

  }

}
