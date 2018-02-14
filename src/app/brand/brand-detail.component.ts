import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Brand } from '../_model/index';

import { BrandService } from '../_services/index';


@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
})
export class BrandDetailComponent implements OnInit {
  constructor(private _brandService: BrandService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private brand: Brand;

  brandForm = new FormGroup ({
    id: new FormControl(),
    name: new FormControl(),
    active: new FormControl()
  });

  ngOnInit() {
    this.createForm();
    this.getBrand();
  }

  createForm() {
    this.brandForm = this._fb.group({
      id: [''],
      name: ['', Validators.required ],
      active: [true]
    });
  }

  get id() { return this.brandForm.get('id'); }
  get name() { return this.brandForm.get('name'); }
  get active() { return this.brandForm.get('active'); }

  getBrand(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.brand = new Brand();
      return;
    }
    this._brandService.get(id)
    .subscribe(
      data => {
        this.brand = data;
        this.id.setValue(data.id);
        this.name.setValue(data.name);
        this.active.setValue(data.active);
      }
    );
  }

  save(): void {
    this.brand.name = this.name.value;
    this.brand.active = this.active.value;
    this._brandService.save(this.brand)
    .subscribe(
      (data: Brand|any) => {
        this.brand = data;
        this._snackBar.open('Marca guardada', '', {
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
