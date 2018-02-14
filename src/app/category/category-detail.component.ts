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

import { CategoryService } from '../_services/index';


@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
})
export class CategoryDetailComponent implements OnInit {
  constructor(private _categoryService: CategoryService,
              private _fb: FormBuilder,
              private _location: Location,
              private _route: ActivatedRoute,
              private _snackBar: MatSnackBar) {}

  private category: Category;

  categoryForm = new FormGroup ({
    id: new FormControl(),
    name: new FormControl(),
    active: new FormControl()
  });

  ngOnInit() {
    this.createForm();
    this.getCategory();
  }

  createForm() {
    this.categoryForm = this._fb.group({
      id: [''],
      name: ['', Validators.required ],
      active: [true]
    });
  }

  get id() { return this.categoryForm.get('id'); }
  get name() { return this.categoryForm.get('name'); }
  get active() { return this.categoryForm.get('active'); }

  getCategory(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.category = new Category();
      return;
    }
    this._categoryService.get(id)
    .subscribe(
      data => {
        this.category = data;
        this.id.setValue(data.id);
        this.name.setValue(data.name);
        this.active.setValue(data.active);
      }
    );
  }

  save(): void {
    this.category.name = this.name.value;
    this.category.active = this.active.value;
    this._categoryService.save(this.category)
    .subscribe(
      (data: Category|any) => {
        this.category = data;
        this._snackBar.open('Categoria guardada', '', {
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
