import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material';
import { Sort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { PageEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Sale } from '../_model/index';
import { PaymentMethod } from '../_model/index';

import { SaleService } from '../_services/index';
import { PaymentMethodService } from '../_services/index';

import { InvalidateDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
})
export class SaleComponent implements OnInit {
  private sales: Sale[];
  paymentMethods: PaymentMethod[];

  displayedColumns = [
    'date',
    'total',
    'paymentmethod',
    'active',
    'actions'
  ];

  dataSource = new MatTableDataSource(this.sales);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;

  searchForm = new FormGroup ({
    date_lteInput: new FormControl(),
    date_gteInput: new FormControl(),
    activeSelect: new FormControl(),
    paymentMethodSelect: new FormControl()
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private active: boolean = undefined;
  private date_gte: Date = null;
  private date_lte: Date = null;
  private paymentMethod: string = null;

  constructor(private _saleService: SaleService,
              private _paymentMethodService: PaymentMethodService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm();
    this.getPaymentMethods();
    this.getSales();
  }

  getSales() {
    this._saleService.getAll(this.limit, this.offset, this.date_gte, this.date_lte, this.active, this.paymentMethod)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.sales = data['results'];
        this.dataSource = new MatTableDataSource(this.sales);
      }
    );
  }

  getPaymentMethods() {
    this._paymentMethodService.getAll(null, null)
    .subscribe(
      data => {
        this.paymentMethods = data;
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getSales();
  }

  createForm() {
    this.searchForm = this._fb.group({
      date_lteInput: [null],
      date_gteInput: [null],
      activeSelect: [null],
      paymentMethodSelect: [null]
    });
  }

  get date_lteInput() { return this.searchForm.get('date_lteInput'); }
  get date_gteInput() { return this.searchForm.get('date_gteInput'); }
  get activeSelect() { return this.searchForm.get('activeSelect'); }
  get paymentMethodSelect() { return this.searchForm.get('paymentMethodSelect'); }

  search() {
    this.date_gte = this.date_gteInput.value;
    this.date_lte = this.date_lteInput.value;
    this.active = this.activeSelect.value;
    this.paymentMethod = this.paymentMethodSelect.value;

    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getSales();
  }

  clear() {
    this.date_gte = null;
    this.date_lte = null;
    this.active = null;
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getSales();
    this.searchForm.reset();
  }

  invalidate(sale): void {
    const dialogRef: MatDialogRef<InvalidateDialogComponent> = this._dialog.open(InvalidateDialogComponent, {
      data: { subject: 'Venta', sale: sale }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._saleService.invalidate(sale)
        .subscribe(
          (data: Sale|any) => {
            sale.active = data.active;
            this._snackBar.open('Venta anulada', '', {
              duration: 3000,
              panelClass: 'snackBar-success'
            });
            // this.back();
          }
        );
      }
    });
  }

}
