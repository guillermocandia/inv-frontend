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

import { Item } from '../_model/index';
import { Category } from '../_model/index';
import { Brand } from '../_model/index';

import { ItemService } from '../_services/index';
import { CategoryService } from '../_services/index';
import { BrandService } from '../_services/index';

import { DeleteDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
})
export class ItemComponent implements OnInit {
  private items: Item[];
  categories: Category[];
  brands: Brand[];

  displayedColumns = [
    'name',
    // 'bar_code',
    'price',
    'stock',
    'stock_min',
    'active',
    'actions'
  ];

  dataSource = new MatTableDataSource(this.items);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;
  private searchText = '';
  private category = '';
  private brand = '';

  searchForm = new FormGroup ({
    searchInput: new FormControl(),
    categorySelect: new FormControl(),
    brandSelect: new FormControl()
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _itemService: ItemService,
              private _categoryService: CategoryService,
              private _brandService: BrandService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.createForm();
    this.getItems();
    this.getCategories();
    this.getBrands();
  }

  getItems() {
    this._itemService.getAll(this.limit, this.offset, this.searchText,
      this.sort, this.category, this.brand)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.items = data['results'];
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.sort = this.sort;
      }
    );
  }

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

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getItems();
  }

  createForm() {
    this.searchForm = this._fb.group({
      searchInput: [''],
      categorySelect: [''],
      brandSelect: ['']
    });
  }

  get searchInput() { return this.searchForm.get('searchInput'); }
  get categorySelect() { return this.searchForm.get('categorySelect'); }
  get brandSelect() { return this.searchForm.get('brandSelect'); }

  search() {
    this.searchText = this.searchInput.value;
    this.category = this.categorySelect.value;
    this.brand = this.brandSelect.value;

    if (this.searchText !== '' || this.category !== '' || this.brand !== '') {
      this.offset = 0;
      this.paginator.pageIndex = 0;
      this.getItems();
    } else {
      this._snackBar.open('Ingrese término a buscar', '', {
        duration: 3000,
        panelClass: 'snackBar-error'
      });
    }
  }

  clear() {
    this.searchText = '';
    this.category = '';
    this.brand = '';
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.sort.direction = '';
    this.getItems();
    this.searchForm.reset();
  }

  sortTable(event: MatSort) {
    if (this.items.length === 0) {
      return;
    }
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getItems();
  }

  delete(element) {
    const dialogRef: MatDialogRef<DeleteDialogComponent> = this._dialog.open(DeleteDialogComponent, {
      data: { subject: 'Producto', data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._itemService.delete(element.id)
        .subscribe(
          data => {
            this.getItems();
          }
        );
      }
    });
  }

}
