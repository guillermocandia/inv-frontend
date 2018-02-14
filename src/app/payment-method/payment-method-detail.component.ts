import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { PaymentMethod } from '../_model/index';

import { PaymentMethodService } from '../_services/index';


@Component({
  selector: 'app-payment-method-detail',
  templateUrl: './payment-method-detail.component.html',
})
export class PaymentMethodDetailComponent implements OnInit {
  constructor(private _paymentMethodService: PaymentMethodService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private paymentMethod: PaymentMethod;

  paymentMethodForm = new FormGroup ({
    id: new FormControl(),
    name: new FormControl(),
    active: new FormControl()
  });

  ngOnInit() {
    this.createForm();
    this.getPaymentMethod();
  }

  createForm() {
    this.paymentMethodForm = this._fb.group({
      id: [''],
      name: ['', Validators.required ],
      active: [true]
    });
  }

  get id() { return this.paymentMethodForm.get('id'); }
  get name() { return this.paymentMethodForm.get('name'); }
  get active() { return this.paymentMethodForm.get('active'); }

  getPaymentMethod(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.paymentMethod = new PaymentMethod();
      return;
    }
    this._paymentMethodService.get(id)
    .subscribe(
      data => {
        this.paymentMethod = data;
        this.id.setValue(data.id);
        this.name.setValue(data.name);
        this.active.setValue(data.active);
      }
    );
  }

  save(): void {
    this.paymentMethod.name = this.name.value;
    this.paymentMethod.active = this.active.value;
    this._paymentMethodService.save(this.paymentMethod)
    .subscribe(
      (data: PaymentItem|any) => {
        this.paymentMethod = data;
        this._snackBar.open('Medio de pago guardada', '', {
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
