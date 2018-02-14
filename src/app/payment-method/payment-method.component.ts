import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
// import { MatSort } from '@angular/material';
// import { Sort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { PageEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { PaymentMethod } from '../_model/index';

import { PaymentMethodService } from '../_services/index';

import { DeleteDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
})
export class PaymentMethodComponent implements OnInit {
  private paymentMethods: PaymentMethod[];
  displayedColumns = ['name', 'active', 'actions'];
  dataSource = new MatTableDataSource(this.paymentMethods);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _paymentMethodService: PaymentMethodService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this._paymentMethodService.getAll(this.limit, this.offset)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.paymentMethods = data['results'];
        this.dataSource = new MatTableDataSource(this.paymentMethods);
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getPaymentMethods();
  }

  delete(element) {
    const dialogRef: MatDialogRef<DeleteDialogComponent> = this._dialog.open(DeleteDialogComponent, {
      data: { subject: 'Medio de pago', data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._paymentMethodService.delete(element.id)
        .subscribe(
          data => {
            this.getPaymentMethods();
          }
        );
      }
    });
  }

}
