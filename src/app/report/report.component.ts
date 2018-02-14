import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Sale } from '../_model/index';
import { PaymentMethod } from '../_model/index';

import { ReportService } from '../_services/index';
import { PaymentMethodService } from '../_services/index';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
})
export class ReportComponent implements OnInit {
  paymentMethods: PaymentMethod[];

  searchForm = new FormGroup ({
    date_lteInput: new FormControl(),
    date_gteInput: new FormControl(),
    activeSelect: new FormControl(),
    paymentMethodSelect: new FormControl()
  });


  private active: boolean = undefined;
  private date_gte: Date = null;
  private date_lte: Date = null;
  private paymentMethod: string = null;

  constructor(private _reportService: ReportService,
              private _paymentMethodService: PaymentMethodService,
              private _fb: FormBuilder,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm();
    this.getPaymentMethods();
  }

  getSales() {
    this._reportService.getAll(null, null, this.date_gte, this.date_lte, this.active, this.paymentMethod)
    .subscribe(
      data => {
        console.log(data.url);
        // window.location.href = 'http://localhost:8000' + data.url;
        window.location.href = data.url;
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

  createForm() {
    const tempDate = new Date();
    this.searchForm = this._fb.group({
      date_lteInput: [new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate())],
      date_gteInput: [new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate())],
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

    this.getSales();
  }

  clear() {
    this.date_gte = null;
    this.date_lte = null;
    this.active = null;
    this.getSales();
    this.searchForm.reset();
  }

}
