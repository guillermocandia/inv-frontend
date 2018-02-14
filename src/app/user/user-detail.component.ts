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


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit {
  constructor(private _userService: UserService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private user: User;

  userForm = new FormGroup ({
    id: new FormControl(),
    username: new FormControl(),
    first_name: new FormControl(),
    last_name: new FormControl(),
    is_staff: new FormControl(),
    is_active: new FormControl()
  });

  ngOnInit() {
    this.createForm();
    this.getUser();
  }

  createForm() {
    this.userForm = this._fb.group({
      id: [''],
      username: ['', Validators.required ],
      first_name: [''],
      last_name: [''],
      is_staff: [false],
      active: [true]
    });
  }

  get id() { return this.userForm.get('id'); }
  get username() { return this.userForm.get('username'); }
  get first_name() { return this.userForm.get('first_name'); }
  get last_name() { return this.userForm.get('last_name'); }
  get is_staff() { return this.userForm.get('is_staff'); }
  get active() { return this.userForm.get('active'); }

  getUser(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.user = new User();
      return;
    }
    this._userService.get(id)
    .subscribe(
      data => {
        this.user = data;
        this.id.setValue(data.id);
        this.username.setValue(data.username);
        this.first_name.setValue(data.first_name);
        this.last_name.setValue(data.last_name);
        this.is_staff.setValue(data.is_staff);
        this.active.setValue(data.is_active);
      }
    );
  }

  save(): void {
    this.user.username = this.username.value;
    this.user.first_name = this.first_name.value;
    this.user.last_name = this.last_name.value;
    this.user.is_staff = this.is_staff.value;
    this.user.is_active = this.active.value;
    this._userService.save(this.user)
    .subscribe(
      (data: User|any) => {
        this.user = data;
        this._snackBar.open('Usuario guardada', '', {
          duration: 3000,
          panelClass: 'snackBar-success'
        });
        this.back();
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
