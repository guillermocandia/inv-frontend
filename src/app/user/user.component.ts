import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material';
import { Sort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { PageEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';

import { User } from '../_model/index';

import { UserService } from '../_services/index';

import { DeleteDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  private users: User[];
  displayedColumns = ['username', 'name', 'is_staff', 'active', 'actions'];
  dataSource = new MatTableDataSource(this.users);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _userService: UserService,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._userService.getAll(this.limit, this.offset)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.users = data['results'];
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getUsers();
  }

  sortTable(event: MatSort) {
    if (this.users.length === 0) {
      return;
    }
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getUsers();
  }

  delete(element) {
    element.name = element.username;

    const dialogRef: MatDialogRef<DeleteDialogComponent> = this._dialog.open(DeleteDialogComponent, {
      data: { subject: 'Usuario', data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._userService.delete(element.id)
        .subscribe(
          data => {
            this.getUsers();
          }
        );
      }
    });
  }

}
