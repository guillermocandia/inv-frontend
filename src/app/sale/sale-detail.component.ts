import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';

import {TimerObservable} from 'rxjs/observable/TimerObservable';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material';

import { InvalidateDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Sale } from '../_model/index';
import { SaleItem } from '../_model/index';
import { Item } from '../_model/index';
import { PaymentMethod } from '../_model/index';

import { SaleService } from '../_services/index';
import { ItemService } from '../_services/index';
import { PaymentMethodService } from '../_services/index';


@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
})
export class SaleDetailComponent implements OnInit, AfterViewInit {
  sale: Sale;
  new: boolean;
  private items: Item[];
  paymentMethods: PaymentMethod[];

  searchForm = new FormGroup ({
    searchInput: new FormControl(),
    paymentMethodSelect: new FormControl()
  });

  @ViewChild('focus') focus: ElementRef;

  constructor(private _saleService: SaleService,
              private _itemService: ItemService,
              private _paymentMethodService: PaymentMethodService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {
    this._route.params.subscribe(params => {
      this.initialize();
    });
  }

  displayedColumns = [
    'bar_code',
    'name',
    'price',
    'quantity',
    'subtotal',
    'actions'
  ];

  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.initialize();
    this.getItems();
    this.getPaymentMethods();
  }

  ngAfterViewInit() {
    if (this.focus) {
      this.focus.nativeElement.focus();
    }
  }

  initialize() {
    this.createForm();
    this.getSale();
    if (this.focus) {
      this.focus.nativeElement.focus();
    }
  }

  createForm() {
    this.searchForm = this._fb.group({
      searchInput: [''],
      paymentMethodSelect: [null]
    });
    this.paymentMethodSelect.markAsTouched();

    this.paymentMethodSelect.valueChanges
    .subscribe(data => {
      this.sale.paymentmethod = data;
      const timer = TimerObservable.create(0);
      const s = timer.subscribe(_ => { // solo para que el focus funcione
        this.focus.nativeElement.focus();
        s.unsubscribe();
      });

    });
  }

  get searchInput() { return this.searchForm.get('searchInput'); }
  get paymentMethodSelect() { return this.searchForm.get('paymentMethodSelect'); }

  getItems(): void {
    this._itemService.getAll(null, null, null, null, null, null)
    .subscribe(
      data => {
        this.items = data;
      }
    );
  }

  getPaymentMethods(): void {
    this._paymentMethodService.getAll(null, null)
    .subscribe(
      data => {
        this.paymentMethods = data;
        if ( this.paymentMethodSelect !== undefined) {
          this.paymentMethodSelect.setValue(this.paymentMethods[0]);
        }
      }
    );
  }

  getSale(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.new = true;
      this.sale = new Sale();
      this.dataSource = new MatTableDataSource(this.sale.saleitem_set);
      return;
    }
    this.new = false;
    this._saleService.get(id)
    .subscribe(
      data => {
        this.sale = data;
        this.dataSource = new MatTableDataSource(this.sale.saleitem_set);
      }
    );
  }

  invalidate(): void {
    const dialogRef: MatDialogRef<InvalidateDialogComponent> = this._dialog.open(InvalidateDialogComponent, {
      data: { subject: 'Venta', sale: this.sale }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._saleService.invalidate(this.sale)
        .subscribe(
          (data: Sale|any) => {
            this.sale.active = data.active;
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

  search() {
    if (this.searchInput.value === '') {
      this.focus.nativeElement.focus();
      return;
    }

    const bar_code = this.searchInput.value;
    const item = this.items.find(x => x.bar_code === bar_code);

    this.searchInput.setValue('');

    if (item === undefined) {
      this._snackBar.open('Producto no encontrado', '', {
        duration: 3000,
        panelClass: 'snackBar-error'
      });
      return;
    }

    this.sale.add(item);
    this.dataSource = new MatTableDataSource(this.sale.saleitem_set);
    this.searchInput.setValue('');
    this.focus.nativeElement.focus();
  }

  add(saleItem: SaleItem) {
    this.sale.add(saleItem.item);
    this.focus.nativeElement.focus();
  }

  sub(saleItem: SaleItem) {
    this.sale.sub(saleItem.item);
    this.dataSource = new MatTableDataSource(this.sale.saleitem_set);
    this.focus.nativeElement.focus();
  }

  del(saleItem: SaleItem) {
    this.sale.del(saleItem.item);
    this.dataSource = new MatTableDataSource(this.sale.saleitem_set);
    this.focus.nativeElement.focus();
  }

  save(): void {
    if (this.sale.paymentmethod === null) {
      this._snackBar.open('Debe seleccionar un medio de pago', '', {
        duration: 3000,
        panelClass: 'snackBar-error'
      });
      return;
    }
    this._saleService.save(this.sale)
    .subscribe(
      (data: Sale|any) => {
        this.sale = data;
        this._snackBar.open('Venta realizada', '', {
          duration: 3000,
          panelClass: 'snackBar-success'
        });
        this.initialize();
        this.paymentMethodSelect.setValue(this.paymentMethods[0]);
      }
    );
  }

  allow_save() {
    return this.searchForm.valid && this.sale.saleitem_set.length > 0;
  }

  // onPaymentMethodChange() {
  //   console.log('focus');
  //
  //   this.focus.nativeElement.focus();
  // }

  cancel () {
    this.initialize();
  }

  back () {
    this._location.back();
  }

}
