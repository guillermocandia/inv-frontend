import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Category } from '../_model/index';
import { Brand } from '../_model/index';
import { Item } from '../_model/index';

import { CategoryService } from '../_services/index';
import { BrandService } from '../_services/index';
import { ItemService } from '../_services/index';


@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
})
export class ItemDetailComponent implements OnInit {
  constructor(private _categoryService: CategoryService,
              private _brandService: BrandService,
              private _itemService: ItemService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private category: string[];
  private brand: string;
  private item: Item;
  private items: Item[];
  private new = false;

  categories: Category[];
  brands: Brand[];

  itemForm = new FormGroup ({
    id: new FormControl(),
    bar_code: new FormControl(),
    name: new FormControl(),
    price: new FormControl(),
    stock: new FormControl(),
    stock_min: new FormControl(),
    active: new FormControl(),
    categorySelect: new FormControl(),
    brandSelect: new FormControl(),
    packaging: new FormControl(),
    comment: new FormControl
  });

  ngOnInit() {
    this.getCategories();
    this.getBrands();
    this.createForm();
    this.getItem();
    this.getItems();
  }

  createForm() {
    this.itemForm = this._fb.group({
      id: [''],
      bar_code: ['', Validators.required ],
      name: ['', Validators.required ],
      price: [0, [Validators.required, Validators.min(0) ]],
      stock: [0],
      stock_min: [0],
      active: [true],
      categorySelect: [],
      brandSelect: [],
      packaging: [null],
      comment: [null]
    });
  }

  get id() { return this.itemForm.get('id'); }
  get bar_code() { return this.itemForm.get('bar_code'); }
  get name() { return this.itemForm.get('name'); }
  get price() { return this.itemForm.get('price'); }
  get stock() { return this.itemForm.get('stock'); }
  get stock_min() { return this.itemForm.get('stock_min'); }
  get active() { return this.itemForm.get('active'); }
  get categorySelect() { return this.itemForm.get('categorySelect'); }
  get brandSelect() { return this.itemForm.get('brandSelect'); }
  get packaging() { return this.itemForm.get('packaging'); }
  get comment() { return this.itemForm.get('comment'); }


  getCategories() {
    this._categoryService.getAll(null, null, null, null, true)
    .subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  getBrands() {
    this._brandService.getAll(null, null, null, null, true)
    .subscribe(
      data => {
        this.brands = data;
      }
    );
  }

  getItem(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.item = new Item();
      this.new = true;
      return;
    }
    this._itemService.get(id)
    .subscribe(
      data => {
        this.item = data;
        this.id.setValue(data.id);
        this.bar_code.setValue(data.bar_code);
        this.name.setValue(data.name);
        this.price.setValue(data.price);
        this.stock.setValue(data.stock);
        this.stock_min.setValue(data.stock_min);
        this.active.setValue(data.active);
        this.categorySelect.setValue(data.category);
        this.brandSelect.setValue(data.brand);
        this.packaging.setValue(data.packaging);
        this.comment.setValue(data.comment);
      }
    );
  }

  save(): void {
    this.item.bar_code = this.bar_code.value;
    this.item.name = this.name.value;
    this.item.price = this.price.value;
    this.item.stock = this.stock.value;
    this.item.stock_min = this.stock_min.value;
    this.item.active = this.active.value;
    this.item.category = this.categorySelect.value;
    this.item.brand = this.brandSelect.value;
    this.item.packaging = this.packaging.value;
    this.item.comment = this.comment.value;

    if (this.item.category ===  null) {
      this.item.category = [];
    }

    // validación existencia de item
    let item: Item;

    if (this.new) {
      item = this.items.find(x => x.bar_code === this.item.bar_code);
      if (item) {
        this._snackBar.open('Código de barra ya existe', '', {
          duration: 3000,
          panelClass: 'snackBar-error'
        });
        return;
      }

      item = this.items.find(x => x.name === this.item.name);
      if (item) {
        this._snackBar.open('Nombre ya existe', '', {
          duration: 3000,
          panelClass: 'snackBar-error'
        });
        return;
      }
    }

    this._itemService.save(this.item)
    .subscribe(
      (data: Item|any) => {
        this.item = data;
        this._snackBar.open('Producto guardado', '', {
          duration: 3000,
          panelClass: 'snackBar-success'
        });
        this.back();
      }
    );
  }

  getItems() {
    this._itemService.getAll(null, null, null,
      null, null, null)
    .subscribe(
      data => {
        this.items = data;
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
