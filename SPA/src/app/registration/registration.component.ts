import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormBuilder, NgForm, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  registerForm: FormGroup;
  

  ngOnInit() {
    this.createRegistration();
  }

  // confirmPassword(g: FormGroup) {
  //   return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  // }
  
  createRegistration() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      isSeller: ['']
    })
  }

}
