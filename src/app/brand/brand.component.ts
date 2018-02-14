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

import { Brand } from '../_model/index';

import { BrandService } from '../_services/index';

import { DeleteDialogComponent } from '../_dialogs/index';

import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
})
export class BrandComponent implements OnInit {
  private brands: Brand[];
  displayedColumns = ['name', 'active', 'actions'];
  dataSource = new MatTableDataSource(this.brands);

  paginatorOptions = {
    length: 0,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50]
  };

  private limit = this.paginatorOptions.pageSize;
  private offset = 0;
  private searchText: string | null = null;

  searchForm = new FormGroup ({
    searchInput: new FormControl()
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _brandService: BrandService,
              private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    this._brandService.getAll(this.limit, this.offset, this.searchText, this.sort)
    .subscribe(
      data => {
        this.paginatorOptions.length = data['count'];
        this.brands = data['results'];
        this.dataSource = new MatTableDataSource(this.brands);
        this.dataSource.sort = this.sort;
      }
    );
  }

  pageEvent(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.getBrands();
  }

  createForm() {
    this.searchForm = this._fb.group({
      searchInput: ['', Validators.required ]
    });
  }

  get searchInput() { return this.searchForm.get('searchInput'); }

  search() {
    this.searchText = this.searchInput.value;
    if (this.searchText !== null && this.searchText !== '') {
      this.offset = 0;
      this.paginator.pageIndex = 0;
      this.getBrands();
    } else {
      this._snackBar.open('Ingrese término a buscar', '', {
        duration: 3000,
        panelClass: 'snackBar-error'
      });
    }
  }

  clear() {
    this.searchText = null;
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.sort.direction = '';
    this.getBrands();
    this.searchForm.reset();
  }

  sortTable(event: MatSort) {
    if (this.brands.length === 0) {
      return;
    }
    this.offset = 0;
    this.paginator.pageIndex = 0;
    this.getBrands();
  }

  delete(element) {
    const dialogRef: MatDialogRef<DeleteDialogComponent> = this._dialog.open(DeleteDialogComponent, {
      data: { subject: 'Marca', data: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this._brandService.delete(element.id)
        .subscribe(
          data => {
            this.getBrands();
          }
        );
      }
    });
  }

}
