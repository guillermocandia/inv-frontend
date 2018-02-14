import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { User } from '../_model/index';

import { UserService } from '../_services/index';
import { AuthService } from '../_services/index';


@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
})
export class UserPasswordComponent implements OnInit {
  constructor(private _userService: UserService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private _authService: AuthService) {}

  private user: User;

  userForm = new FormGroup ({
    id: new FormControl(),
    password_new: new FormControl(),
    password_new_repeat: new FormControl()
  });

  ngOnInit() {
    this.createForm();
    const id = this._route.snapshot.paramMap.get('id');
    this.id.setValue(id);
  }

  createForm() {
    this.userForm = this._fb.group({
      id: [''],
      password_new: ['', Validators.required ],
      password_new_repeat: ['', Validators.required]
    });
  }

  get id() { return this.userForm.get('id'); }
  get password_new() { return this.userForm.get('password_new'); }
  get password_new_repeat() { return this.userForm.get('password_new_repeat'); }


  save(): void {
    this._userService.updatePassword(this.id.value, this.password_new.value)
    .subscribe(
      () => {
        this._snackBar.open('Usuario guardada', '', {
          duration: 3000,
          panelClass: 'snackBar-success'
        });
        this.back();
      }
      , (error) => {
        this._snackBar.open('Error', '', {
          duration: 3000,
          panelClass: 'snackBar-error'
        });
      }
    );
  }

  cancel () {
    this.back();
  }

  back () {
    this._location.back();
  }

}
