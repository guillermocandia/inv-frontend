import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { UserLogin } from '../_model/index';

import { AuthService } from '../_services/index';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup ({
    username: new FormControl(),
    password: new FormControl()
  });

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this._fb.group({
      username: ['', Validators.required ],
      password: ['', Validators.required ]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  public login() {
    const userlogin = new UserLogin();
    userlogin.username = this.username.value;
    userlogin.password = this.password.value;
    this._authService.login(userlogin)
    .subscribe(
      (data: boolean) => {
        this._snackBar.open('Bienvenido', '', {
          duration: 3000,
          panelClass: 'snackBar-success'
        });
      },
      error => {
        this._snackBar.open('Usuario o Contraseña erróneos', '', {
          duration: 3000,
          panelClass: 'snackBar-error'
        });
      }
    );
  }

  onClickLogout() {
    this._authService.logout();
  }

}
