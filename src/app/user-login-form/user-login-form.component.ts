import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.css']
})
export class UserLoginFormComponent implements OnInit {
  public form!: FormGroup;
  public username!: FormControl;
  public password!: FormControl;

  constructor() { }

  ngOnInit(): void {
    this.username = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.form = new FormGroup({
      'username': this.username,
      'password': this.password,
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      console.log('Form is valid!');
    } else {
      console.log('Form is not valid.');
    }
  }
}
